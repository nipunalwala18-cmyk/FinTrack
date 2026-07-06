import { AiProvider, ChatCompletionOptions, ChatCompletionResult } from './ai-provider.interface.js';
import { AppError } from '../../../utils/AppError.js';

export class OpenRouterProvider implements AiProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY || '';
    this.baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.model = process.env.OPENROUTER_MODEL || 'openrouter/free';

    if (!this.apiKey) {
      console.warn('⚠️ Warning: OPENROUTER_API_KEY is not defined in the environment variables.');
    }
  }

  public async chat(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    if (!this.apiKey) {
      throw new AppError('AI provider is not configured. Please add OPENROUTER_API_KEY to your environment variables.', 500);
    }

    const messages = [];

    // Add system prompt if provided
    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }

    // Add conversation history
    messages.push(...options.messages);

    const body: any = {
      model: this.model,
      messages,
    };

    if (options.tools && options.tools.length > 0) {
      body.tools = options.tools.map((tool) => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
      }));
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'FinTrack AI Assistant',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter Error Response:', errorText);
        throw new AppError(`OpenRouter API error: ${response.statusText} (${response.status})`, response.status);
      }

      const data = (await response.json()) as any;
      const choice = data.choices?.[0];

      if (!choice) {
        throw new AppError('No response choices returned from AI provider.', 500);
      }

      const message = choice.message;
      const content = message?.content || null;
      let toolCalls: any[] | undefined = undefined;

      if (message?.tool_calls && message.tool_calls.length > 0) {
        toolCalls = message.tool_calls.map((tc: any) => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        }));
      }

      return {
        content,
        toolCalls,
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error calling OpenRouter:', error);
      throw new AppError(`Failed to communicate with AI provider: ${error.message}`, 500);
    }
  }
}
