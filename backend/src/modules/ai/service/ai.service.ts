import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../utils/AppError.js';
import { ProviderFactory } from '../provider/provider.factory.js';
import { FinancialContextService } from '../context/financial-context.service.js';
import { PromptBuilder } from '../prompts/prompt-builder.js';
import { MemoryService } from '../memory/memory.service.js';
import { ToolRegistry } from '../tools/registry/tool.registry.js';
import { initializeTools } from '../tools/index.js';

// Initialize AI tools registry
initializeTools();

const contextService = new FinancialContextService();
const memoryService = new MemoryService();

export class AiService {
  public async getConversations(userId: string) {
    return prisma.aiConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  public async getConversationById(id: string, userId: string) {
    const conversation = await prisma.aiConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new AppError('Conversation not found', 404);
    }

    return conversation;
  }

  public async deleteConversation(id: string, userId: string) {
    const conversation = await prisma.aiConversation.findUnique({
      where: { id },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new AppError('Conversation not found', 404);
    }

    await prisma.aiConversation.delete({
      where: { id },
    });

    return { id };
  }

  public async chat(userId: string, conversationId: string | null, content: string) {
    // 1. Resolve or create conversation
    let conversation: any;
    if (conversationId) {
      conversation = await prisma.aiConversation.findUnique({
        where: { id: conversationId },
      });
      if (!conversation || conversation.userId !== userId) {
        throw new AppError('Conversation not found', 404);
      }
    } else {
      // Create new conversation
      const snippet = content.slice(0, 30);
      conversation = await prisma.aiConversation.create({
        data: {
          userId,
          title: snippet.length >= 30 ? `${snippet}...` : snippet,
        },
      });
    }

    // 2. Save user message to database
    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content,
      },
    });

    // 3. Load conversation state/memory
    const memory = await memoryService.getConversationState(conversation.id);

    // 4. Handle confirmation flow for pending intents (e.g. deletion confirmation)
    if (memory && memory.pendingIntent) {
      const lowerContent = content.trim().toLowerCase();
      if (lowerContent === 'yes' || lowerContent === 'confirm' || lowerContent === 'y') {
        const intent = memory.pendingIntent;
        const params = memory.temporaryParameters as any;

        // Clear memory first to prevent loop
        await memoryService.clearConversationState(conversation.id);

        // Execute the pending tool
        const actionResult = await ToolRegistry.execute(intent, userId, params);

        // Save assistant response representing success
        const assistantMsg = await prisma.aiMessage.create({
          data: {
            conversationId: conversation.id,
            role: 'assistant',
            content: `Action Confirmed. ${actionResult.message}`,
            toolExecuted: intent,
            toolSuccess: actionResult.success,
          },
        });

        // Update conversation updated time
        await prisma.aiConversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });

        return {
          conversationId: conversation.id,
          message: assistantMsg,
          refresh: actionResult.refresh,
        };
      } else if (lowerContent === 'no' || lowerContent === 'cancel' || lowerContent === 'n') {
        // Cancel the intent
        await memoryService.clearConversationState(conversation.id);

        const assistantMsg = await prisma.aiMessage.create({
          data: {
            conversationId: conversation.id,
            role: 'assistant',
            content: 'Action cancelled. Let me know if there is anything else I can do.',
          },
        });

        return {
          conversationId: conversation.id,
          message: assistantMsg,
          refresh: [],
        };
      }
    }

    // 5. Load recent history for the LLM prompt
    const recentMessages = await prisma.aiMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 15,
    });

    const llmMessages = recentMessages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    // 6. Fetch user context & build prompt
    const context = await contextService.getFinancialContext(userId);
    const userPrefs = await prisma.userPreferences.findUnique({
      where: { userId },
    });
    const enrichedContext = {
      ...context,
      preferences: userPrefs,
    };
    const systemPrompt = PromptBuilder.buildSystemPrompt(enrichedContext, memory);

    // 7. Call LLM
    const provider = ProviderFactory.getProvider();
    const tools = ToolRegistry.getToolDefinitions();

    const response = await provider.chat({
      messages: llmMessages,
      systemPrompt,
      tools,
    });

    let assistantResponseContent = response.content || '';
    let refreshModules: string[] = [];
    let executedToolName: string | null = null;
    let toolSuccess: boolean | null = null;

    // 8. Handle Tool Calls
    if (response.toolCalls && response.toolCalls.length > 0) {
      const toolCall = response.toolCalls[0]; // Process first tool call
      const name = toolCall.function.name;
      executedToolName = name;

      let args: any = {};
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch (err) {
        console.error('Failed to parse tool arguments:', err);
      }

      // Check if it is a destructive action requiring confirmation (e.g. deleteTransaction)
      if (name === 'deleteTransaction') {
        // Save to state/memory for confirmation turn
        await memoryService.updateConversationState(conversation.id, {
          pendingIntent: name,
          temporaryParameters: args,
        });

        assistantResponseContent = `⚠️ **Confirm Action**: Are you sure you want to delete this transaction? Please reply **Yes** to confirm or **No** to cancel.`;
      } else {
        // Execute tool immediately
        const actionResult = await ToolRegistry.execute(name, userId, args);
        toolSuccess = actionResult.success;
        assistantResponseContent = actionResult.message;
        refreshModules = actionResult.refresh;

        // If the tool execution wants to return data or custom text details to LLM, we can do it,
        // but simple feedback is fine. If the model had content, append it.
        if (response.content) {
          assistantResponseContent = `${response.content}\n\n${actionResult.message}`;
        }
      }
    }

    // 9. Save assistant response to DB
    const assistantMsg = await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantResponseContent,
        toolExecuted: executedToolName,
        toolSuccess,
      },
    });

    // Update conversation updatedAt
    await prisma.aiConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return {
      conversationId: conversation.id,
      message: assistantMsg,
      refresh: refreshModules,
    };
  }
}
export default AiService;
