import { prisma } from '../../../config/prisma.js';

export class MemoryService {
  public async getConversationState(conversationId: string) {
    return prisma.aiConversationState.findUnique({
      where: { conversationId },
    });
  }

  public async updateConversationState(
    conversationId: string,
    data: {
      pendingIntent?: string | null;
      temporaryParameters?: any;
      lastTool?: string | null;
    }
  ) {
    const current = await this.getConversationState(conversationId);

    const mergedParams =
      data.temporaryParameters !== undefined
        ? {
            ...(current?.temporaryParameters as any || {}),
            ...data.temporaryParameters,
          }
        : undefined;

    return prisma.aiConversationState.upsert({
      where: { conversationId },
      create: {
        conversationId,
        pendingIntent: data.pendingIntent || null,
        temporaryParameters: data.temporaryParameters || {},
        lastTool: data.lastTool || null,
      },
      update: {
        pendingIntent: data.pendingIntent !== undefined ? data.pendingIntent : undefined,
        temporaryParameters: mergedParams,
        lastTool: data.lastTool !== undefined ? data.lastTool : undefined,
      },
    });
  }

  public async clearConversationState(conversationId: string) {
    return prisma.aiConversationState.deleteMany({
      where: { conversationId },
    });
  }
}
export default MemoryService;
