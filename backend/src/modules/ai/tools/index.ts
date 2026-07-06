import { ToolRegistry } from './registry/tool.registry.js';
import { CreateAccountTool, GetBalancesTool } from './account.tool.js';
import {
  CreateTransactionTool,
  UpdateTransactionTool,
  DeleteTransactionTool,
  SearchTransactionsTool,
} from './transaction.tool.js';
import { CreateGoalTool, AddContributionTool, GetGoalProgressTool } from './goal.tool.js';
import { CreateBudgetTool, UpdateBudgetTool, GetBudgetStatusTool } from './budget.tool.js';
import { GetMonthlySummaryTool, GetCategorySummaryTool } from './report.tool.js';

export function initializeTools() {
  ToolRegistry.register(new CreateAccountTool());
  ToolRegistry.register(new GetBalancesTool());
  ToolRegistry.register(new CreateTransactionTool());
  ToolRegistry.register(new UpdateTransactionTool());
  ToolRegistry.register(new DeleteTransactionTool());
  ToolRegistry.register(new SearchTransactionsTool());
  ToolRegistry.register(new CreateGoalTool());
  ToolRegistry.register(new AddContributionTool());
  ToolRegistry.register(new GetGoalProgressTool());
  ToolRegistry.register(new CreateBudgetTool());
  ToolRegistry.register(new UpdateBudgetTool());
  ToolRegistry.register(new GetBudgetStatusTool());
  ToolRegistry.register(new GetMonthlySummaryTool());
  ToolRegistry.register(new GetCategorySummaryTool());
}
