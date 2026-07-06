export interface AiActionResult {
  success: boolean;
  message: string;
  data: any;
  refresh: string[]; // Modules to trigger reload, e.g. ['transactions', 'dashboard', 'goals', 'budgets', 'accounts']
}

export interface AiTool {
  name: string;
  description: string;
  schema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  execute(userId: string, input: any): Promise<AiActionResult>;
}
