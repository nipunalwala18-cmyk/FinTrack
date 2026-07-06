import { AiTool, AiActionResult } from './tool.interface.js';

export class ToolRegistry {
  private static tools = new Map<string, AiTool>();

  public static register(tool: AiTool): void {
    this.tools.set(tool.name, tool);
  }

  public static getTool(name: string): AiTool | undefined {
    return this.tools.get(name);
  }

  public static getToolDefinitions() {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.schema,
    }));
  }

  public static async execute(
    name: string,
    userId: string,
    args: any
  ): Promise<AiActionResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        success: false,
        message: `Tool '${name}' is not registered in the assistant registry.`,
        data: null,
        refresh: [],
      };
    }

    try {
      return await tool.execute(userId, args);
    } catch (error: any) {
      console.error(`Error executing tool ${name}:`, error);
      return {
        success: false,
        message: `Tool execution failed: ${error.message || error}`,
        data: null,
        refresh: [],
      };
    }
  }
}
