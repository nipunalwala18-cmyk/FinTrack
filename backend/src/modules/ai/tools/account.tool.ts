import { AiTool, AiActionResult } from './registry/tool.interface.js';
import { AccountsService } from '../../accounts/accounts.service.js';
import { AccountType } from '@prisma/client';

const accountsService = new AccountsService();

export class CreateAccountTool implements AiTool {
  public name = 'createAccount';
  public description = 'Create a new financial account (e.g. Bank Account, Cash, Credit Card, Investment, E-Wallet).';
  public schema = {
    type: 'object' as const,
    properties: {
      name: {
        type: 'string',
        description: 'Name of the account, e.g. "HDFC Salary Account", "Pocket Cash".',
      },
      type: {
        type: 'string',
        enum: [AccountType.CASH, AccountType.BANK, AccountType.CREDIT_CARD, AccountType.INVESTMENT, AccountType.E_WALLET],
        description: 'The type of the account.',
      },
      balance: {
        type: 'number',
        description: 'Initial balance of the account (default is 0).',
      },
      color: {
        type: 'string',
        description: 'Hex color string for UI grouping (optional).',
      },
    },
    required: ['name', 'type'],
  };

  public async execute(userId: string, input: any): Promise<AiActionResult> {
    const data = {
      name: input.name,
      type: input.type,
      balance: input.balance ?? 0,
      color: input.color ?? '#3b82f6',
    };

    const newAccount = await accountsService.createAccount(userId, data);

    return {
      success: true,
      message: `Successfully created account '${newAccount.name}' with type ${newAccount.type} and balance ₹${newAccount.balance}.`,
      data: newAccount,
      refresh: ['accounts', 'dashboard'],
    };
  }
}

export class GetBalancesTool implements AiTool {
  public name = 'getBalances';
  public description = 'Get lists of all accounts and their respective balances.';
  public schema = {
    type: 'object' as const,
    properties: {},
  };

  public async execute(userId: string): Promise<AiActionResult> {
    const accounts = await accountsService.getAccounts(userId);

    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.isArchived ? 0 : acc.balance), 0);

    return {
      success: true,
      message: `Fetched ${accounts.length} accounts. Total net balance is ₹${totalBalance}.`,
      data: {
        accounts,
        totalBalance,
      },
      refresh: [],
    };
  }
}
