import { AiTool, AiActionResult } from './registry/tool.interface.js';
import { GoalService } from '../../goals/goal.service.js';
import { TransactionsService } from '../../transactions/transactions.service.js';
import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../utils/AppError.js';
import { GoalType } from '@prisma/client';

const goalService = new GoalService();
const transactionsService = new TransactionsService();

// Helper to resolve Account Name to ID
async function resolveAccountId(userId: string, name: string): Promise<string> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      name: { contains: name, mode: 'insensitive' },
      isArchived: false,
    },
  });
  if (!account) {
    throw new AppError(`Account matching '${name}' not found.`, 404);
  }
  return account.id;
}

// Helper to resolve Goal Name to Goal object
async function resolveGoal(userId: string, name: string) {
  const goal = await prisma.goal.findFirst({
    where: {
      userId,
      name: { contains: name, mode: 'insensitive' },
      status: 'ACTIVE',
    },
  });
  if (!goal) {
    throw new AppError(`Active goal matching '${name}' not found.`, 404);
  }
  return goal;
}

export class CreateGoalTool implements AiTool {
  public name = 'createGoal';
  public description = 'Create a new financial goal (e.g. Save for a house, New laptop).';
  public schema = {
    type: 'object' as const,
    properties: {
      name: {
        type: 'string',
        description: 'Name of the goal.',
      },
      description: {
        type: 'string',
        description: 'Goal description (optional).',
      },
      targetAmount: {
        type: 'number',
        description: 'Target savings amount in INR (positive number).',
      },
      targetDate: {
        type: 'string',
        description: 'The target date to achieve this goal (ISO format YYYY-MM-DD).',
      },
      color: {
        type: 'string',
        description: 'Hex color value for grouping (optional).',
      },
      icon: {
        type: 'string',
        description: 'Lucide icon name (optional).',
      },
    },
    required: ['name', 'targetAmount', 'targetDate'],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    const payload = {
      name: input.name,
      description: input.description || null,
      goalType: GoalType.SAVINGS,
      targetAmount: input.targetAmount,
      targetDate: new Date(input.targetDate),
      color: input.color || '#9333ea',
      icon: input.icon || 'Target',
    };

    const newGoal = await goalService.createGoal(userId, payload);

    return {
      success: true,
      message: `Successfully created goal '${newGoal.name}' with a target of ₹${newGoal.targetAmount} by ${new Date(newGoal.targetDate).toLocaleDateString()}.`,
      data: newGoal,
      refresh: ['goals', 'dashboard'],
    };
  }
}

export class AddContributionTool implements AiTool {
  public name = 'addContribution';
  public description = 'Deposit or withdraw funds from a goal. This automatically creates a linked transaction.';
  public schema = {
    type: 'object' as const,
    properties: {
      goalName: {
        type: 'string',
        description: 'The name of the target goal.',
      },
      amount: {
        type: 'number',
        description: 'Amount in INR to allocate (positive number).',
      },
      accountName: {
        type: 'string',
        description: 'The source account name from which money is funded (e.g. HDFC, Cash).',
      },
      type: {
        type: 'string',
        enum: ['DEPOSIT', 'WITHDRAWAL'],
        description: 'Type of contribution (DEPOSIT to fund goal, WITHDRAWAL to retrieve). Defaults to DEPOSIT.',
      },
    },
    required: ['goalName', 'amount', 'accountName'],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    const goal = await resolveGoal(userId, input.goalName);
    const accountId = await resolveAccountId(userId, input.accountName);
    const type = input.type || 'DEPOSIT';

    // Create an Expense/Income transaction representing this contribution
    const txPayload = {
      type: type === 'DEPOSIT' ? 'EXPENSE' : 'INCOME', // deposit moves money out of regular account, withdrawal adds back
      amount: input.amount,
      accountId,
      description: `${type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} to Goal: ${goal.name}`,
      date: new Date(),
      goalId: goal.id,
      contributionType: type,
    };

    const tx = await transactionsService.createTransaction(userId, txPayload);

    // Fetch the updated goal details (since the transaction recalculates it)
    const updatedGoal = await goalService.getGoalById(goal.id, userId);

    return {
      success: true,
      message: `Successfully recorded ₹${input.amount} ${type.toLowerCase()} for goal '${updatedGoal.name}'. Current status: ₹${updatedGoal.savedAmount} / ₹${updatedGoal.targetAmount} (${updatedGoal.progress}% completed).`,
      data: {
        transaction: tx,
        goal: updatedGoal,
      },
      refresh: ['goals', 'transactions', 'dashboard', 'accounts'],
    };
  }
}

export class GetGoalProgressTool implements AiTool {
  public name = 'getGoalProgress';
  public description = 'Retrieve the current list of goals, showing saved amounts, targets, and percentage progress.';
  public schema = {
    type: 'object' as const,
    properties: {},
  };

  public async execute(userId: string): Promise<AiActionResult> {
    const goals = await goalService.getGoals(userId);

    return {
      success: true,
      message: `Fetched progress for ${goals.length} goals.`,
      data: goals,
      refresh: [],
    };
  }
}
