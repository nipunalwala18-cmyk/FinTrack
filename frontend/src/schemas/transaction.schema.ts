import { z } from 'zod';

export const createTransactionSchema = z
  .object({
    amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be positive'),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER'] as const),
    description: z.string().max(100, 'Description must be at most 100 characters').optional().nullable(),
    notes: z.string().max(500, 'Notes must be at most 500 characters').optional().nullable(),
    date: z.string().min(1, 'Date is required'),
    accountId: z.string().min(1, 'Source account is required'),
    toAccountId: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === 'TRANSFER') {
        return !!data.toAccountId && data.toAccountId !== data.accountId;
      }
      return true;
    },
    {
      message: 'Transfer requires a different destination account',
      path: ['toAccountId'],
    }
  )
  .refine(
    (data) => {
      if (data.type !== 'TRANSFER') {
        return !!data.categoryId && data.categoryId.trim() !== '';
      }
      return true;
    },
    {
      message: 'Category is required for Income and Expense transactions',
      path: ['categoryId'],
    }
  );

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = Partial<CreateTransactionInput>;
