import { AiTool, AiActionResult } from './registry/tool.interface.js';
import { TransactionsService } from '../../transactions/transactions.service.js';
import { prisma } from '../../../config/prisma.js';
import { TransactionType } from '@prisma/client';
import { AppError } from '../../../utils/AppError.js';

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

// Helper to resolve Category Name to ID
async function resolveCategoryId(userId: string, name: string, type: 'INCOME' | 'EXPENSE'): Promise<string> {
  // Check user-defined and default categories
  const category = await prisma.category.findFirst({
    where: {
      deletedAt: null,
      name: { contains: name, mode: 'insensitive' },
      type,
      OR: [
        { userId },
        { isDefault: true },
      ],
    },
  });
  
  if (!category) {
    // If not found, let's create a new category for the user
    const newCat = await prisma.category.create({
      data: {
        userId,
        name,
        type,
        color: '#9333ea',
        icon: 'Compass',
      },
    });
    return newCat.id;
  }
  return category.id;
}

export class CreateTransactionTool implements AiTool {
  public name = 'createTransaction';
  public description = 'Create a new transaction (Income, Expense, or Transfer). Use this when user says: "I spent ₹500 on groceries today" or "Recieved ₹50000 salary to Bank Account".';
  public schema = {
    type: 'object' as const,
    properties: {
      type: {
        type: 'string',
        enum: [TransactionType.INCOME, TransactionType.EXPENSE, TransactionType.TRANSFER],
        description: 'The type of the transaction.',
      },
      amount: {
        type: 'number',
        description: 'The transaction amount in INR (positive number).',
      },
      accountName: {
        type: 'string',
        description: 'The source account name, e.g. "Cash", "Bank".',
      },
      toAccountName: {
        type: 'string',
        description: 'The destination account name (Only required if type is TRANSFER).',
      },
      categoryName: {
        type: 'string',
        description: 'Category name (e.g. "Food", "Groceries", "Salary"). Optional for transfers.',
      },
      description: {
        type: 'string',
        description: 'Brief description of the transaction.',
      },
      date: {
        type: 'string',
        description: 'Date of the transaction (ISO format YYYY-MM-DD). Defaults to current date if not specified.',
      },
    },
    required: ['type', 'amount', 'accountName'],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    const accountId = await resolveAccountId(userId, input.accountName);
    let toAccountId = null;
    let categoryId = null;

    if (input.type === TransactionType.TRANSFER) {
      if (!input.toAccountName) {
        throw new AppError('Destination account (toAccountName) is required for transfers.', 400);
      }
      toAccountId = await resolveAccountId(userId, input.toAccountName);
    } else if (input.categoryName) {
      categoryId = await resolveCategoryId(userId, input.categoryName, input.type);
    }

    const payload = {
      type: input.type,
      amount: input.amount,
      accountId,
      toAccountId,
      categoryId,
      description: input.description || `${input.type} Transaction`,
      date: input.date ? new Date(input.date) : new Date(),
    };

    const newTx = await transactionsService.createTransaction(userId, payload);

    return {
      success: true,
      message: `Successfully created ${newTx.type} transaction of ₹${newTx.amount} on ${new Date(newTx.date).toLocaleDateString()}. Description: "${newTx.description}".`,
      data: newTx,
      refresh: ['transactions', 'dashboard', 'accounts', 'budgets', 'goals'],
    };
  }
}

export class UpdateTransactionTool implements AiTool {
  public name = 'updateTransaction';
  public description = 'Update an existing transaction details.';
  public schema = {
    type: 'object' as const,
    properties: {
      transactionId: {
        type: 'string',
        description: 'The exact ID of the transaction to update.',
      },
      amount: {
        type: 'number',
        description: 'New amount.',
      },
      description: {
        type: 'string',
        description: 'New description.',
      },
      categoryName: {
        type: 'string',
        description: 'New category name.',
      },
      accountName: {
        type: 'string',
        description: 'New account name.',
      },
    },
    required: ['transactionId'],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    const payload: any = {};
    if (input.amount !== undefined) payload.amount = input.amount;
    if (input.description !== undefined) payload.description = input.description;
    
    if (input.accountName) {
      payload.accountId = await resolveAccountId(userId, input.accountName);
    }

    const currentTx = await prisma.transaction.findFirst({
      where: { id: input.transactionId, userId },
    });

    if (!currentTx) {
      throw new AppError('Transaction not found', 404);
    }

    if (input.categoryName && currentTx.type !== 'TRANSFER') {
      payload.categoryId = await resolveCategoryId(userId, input.categoryName, currentTx.type as 'INCOME' | 'EXPENSE');
    }

    const updated = await transactionsService.updateTransaction(input.transactionId, userId, payload);

    return {
      success: true,
      message: `Successfully updated transaction. New amount: ₹${updated.amount}, Description: "${updated.description}".`,
      data: updated,
      refresh: ['transactions', 'dashboard', 'accounts', 'budgets', 'goals'],
    };
  }
}

export class DeleteTransactionTool implements AiTool {
  public name = 'deleteTransaction';
  public description = 'Delete a transaction from history.';
  public schema = {
    type: 'object' as const,
    properties: {
      transactionId: {
        type: 'string',
        description: 'The exact ID of the transaction to delete.',
      },
    },
    required: ['transactionId'],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    await transactionsService.deleteTransaction(input.transactionId, userId);

    return {
      success: true,
      message: 'Transaction successfully deleted.',
      data: { id: input.transactionId },
      refresh: ['transactions', 'dashboard', 'accounts', 'budgets', 'goals'],
    };
  }
}

export class SearchTransactionsTool implements AiTool {
  public name = 'searchTransactions';
  public description = 'Search or filter transaction history by query, type, or date range.';
  public schema = {
    type: 'object' as const,
    properties: {
      search: {
        type: 'string',
        description: 'Search string matching description or category.',
      },
      type: {
        type: 'string',
        enum: ['INCOME', 'EXPENSE', 'TRANSFER'],
        description: 'Filter by transaction type.',
      },
      limit: {
        type: 'number',
        description: 'Limit results (default is 10).',
      },
    },
    required: [],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    const filters = {
      userId,
      search: input.search || '',
      type: input.type,
      page: 1,
      limit: input.limit || 10,
      sortBy: 'date' as 'date' | 'amount',
      sortOrder: 'desc' as const,
    };

    const results = await transactionsService.getTransactions(filters);

    return {
      success: true,
      message: `Found ${results.transactions.length} matching transactions.`,
      data: results.transactions,
      refresh: [],
    };
  }
}
