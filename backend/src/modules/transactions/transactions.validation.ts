import { z } from 'zod';
import { TransactionType } from '@prisma/client';

const baseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE, TransactionType.TRANSFER]),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  date: z.string().transform((str) => new Date(str)),
  accountId: z.string().min(1, 'Source account is required'),
  toAccountId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
});

export const createTransactionSchema = baseSchema
  .refine(
    (data) => {
      if (data.type === TransactionType.TRANSFER) {
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
      if (data.type !== TransactionType.TRANSFER) {
        return !!data.categoryId;
      }
      return true;
    },
    {
      message: 'Category is required for Income and Expense transactions',
      path: ['categoryId'],
    }
  );

const basePartialSchema = baseSchema.partial();
export const updateTransactionSchema = basePartialSchema
  .refine(
    (data) => {
      if (data.type === TransactionType.TRANSFER) {
        if (data.accountId && data.toAccountId) {
          return data.toAccountId !== data.accountId;
        }
        return !!data.toAccountId;
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
      if (data.type && data.type !== TransactionType.TRANSFER) {
        return !!data.categoryId;
      }
      return true;
    },
    {
      message: 'Category is required for Income and Expense transactions',
      path: ['categoryId'],
    }
  );
