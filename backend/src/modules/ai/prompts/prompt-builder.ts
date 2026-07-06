import { DEFAULT_SYSTEM_INSTRUCTIONS } from './system.prompt.js';

export class PromptBuilder {
  public static buildSystemPrompt(context: any, conversationState?: any): string {
    let prompt = DEFAULT_SYSTEM_INSTRUCTIONS;

    // Append current financial context
    prompt += `\n\n### CURRENT FINANCIAL CONTEXT (TODAY IS ${context.currentDate})`;
    prompt += `\n- **Accounts & Balances**: ${
      context.accounts && context.accounts.length > 0
        ? context.accounts.map((a: any) => `${a.name} (${a.type}): ₹${a.balance}`).join(', ')
        : 'No accounts created yet.'
    }`;
    
    prompt += `\n- **Expense/Income Categories**: ${
      context.categories && context.categories.length > 0
        ? context.categories.map((c: any) => `${c.name} (${c.type})`).join(', ')
        : 'No categories.'
    }`;

    prompt += `\n- **Active Savings Goals**: ${
      context.goals && context.goals.length > 0
        ? context.goals.map((g: any) => `'${g.name}' (Target: ₹${g.targetAmount}, Current Saved: ₹${g.currentAmount}, Target Date: ${g.targetDate ? new Date(g.targetDate).toLocaleDateString() : 'N/A'})`).join(', ')
        : 'No active goals.'
    }`;

    prompt += `\n- **Current Budgets**: ${
      context.budgets && context.budgets.length > 0
        ? context.budgets.map((b: any) => `Category: ${b.categoryName}, Limit: ₹${b.amount}, Period: ${b.period.toLowerCase()}`).join(', ')
        : 'No budgets defined.'
    }`;

    prompt += `\n- **Recent Transactions (Last 10)**: \n${
      context.recentTransactions && context.recentTransactions.length > 0
        ? context.recentTransactions
            .map((t: any) => `  * [${new Date(t.date).toISOString().split('T')[0]}] ${t.type}: ₹${t.amount} | Desc: "${t.description}" | Category: ${t.categoryName} | Account: ${t.accountName}`)
            .join('\n')
        : '  * No transactions recorded.'
    }`;

    if (conversationState) {
      prompt += `\n\n### CONVERSATION MEMORY`;
      if (conversationState.pendingIntent) {
        prompt += `\n- **Pending User Intent**: ${conversationState.pendingIntent}`;
      }
      if (conversationState.temporaryParameters) {
        prompt += `\n- **Gathered Parameters**: ${JSON.stringify(conversationState.temporaryParameters)}`;
      }
      if (conversationState.lastTool) {
        prompt += `\n- **Last Executed Tool**: ${conversationState.lastTool}`;
      }
    }

    return prompt;
  }
}
export default PromptBuilder;
