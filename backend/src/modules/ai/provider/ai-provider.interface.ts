export interface MessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>; // JSON Schema format
}

export interface ChatCompletionOptions {
  messages: MessageParam[];
  tools?: ToolDefinition[];
  systemPrompt?: string;
}

export interface ChatCompletionResult {
  content: string | null;
  toolCalls?: {
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string; // JSON string representation
    };
  }[];
}

export interface AiProvider {
  chat(options: ChatCompletionOptions): Promise<ChatCompletionResult>;
}
