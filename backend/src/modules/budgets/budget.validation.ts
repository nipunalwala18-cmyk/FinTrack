import { z } from 'zod';
import { BudgetPeriod } from '@prisma/client';

export const createBudgetSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'Category is required'),
    period: z.enum([BudgetPeriod.WEEKLY, BudgetPeriod.MONTHLY, BudgetPeriod.YEARLY]),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    amount: z.number().positive('Budget amount must be greater than zero'),
    alertAt: z.number().int().min(1).max(100).optional().nullable(),
  }),
});

export const updateBudgetSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    period: z.enum([BudgetPeriod.WEEKLY, BudgetPeriod.MONTHLY, BudgetPeriod.YEARLY]).optional(),
    startDate: z.string().transform((str) => new Date(str)).optional(),
    endDate: z.string().transform((str) => new Date(str)).optional(),
    amount: z.number().positive('Budget amount must be greater than zero').optional(),
    alertAt: z.number().int().min(1).max(100).optional().nullable(),
  }),
});
