import { z } from 'zod';
import { GoalType, GoalPeriod, GoalStatus } from '@prisma/client';

export const createGoalSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable().optional(),
    goalType: z.enum([GoalType.SAVINGS, GoalType.EXPENSE_LIMIT, GoalType.INCOME_TARGET]).optional().nullable(),
    period: z.enum([GoalPeriod.WEEKLY, GoalPeriod.MONTHLY, GoalPeriod.YEARLY]).optional().nullable(),
    targetAmount: z.number().positive('Target amount must be greater than zero'),
    startDate: z.string().transform((str) => new Date(str)).optional().nullable(),
    endDate: z.string().transform((str) => new Date(str)).optional().nullable(),
    targetDate: z.string().transform((str) => new Date(str)),
    color: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
  }),
});

export const updateGoalSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    description: z.string().nullable().optional(),
    goalType: z.enum([GoalType.SAVINGS, GoalType.EXPENSE_LIMIT, GoalType.INCOME_TARGET]).optional().nullable(),
    period: z.enum([GoalPeriod.WEEKLY, GoalPeriod.MONTHLY, GoalPeriod.YEARLY]).optional().nullable(),
    targetAmount: z.number().positive('Target amount must be greater than zero').optional(),
    startDate: z.string().transform((str) => new Date(str)).optional().nullable(),
    endDate: z.string().transform((str) => new Date(str)).optional().nullable(),
    targetDate: z.string().transform((str) => new Date(str)).optional().nullable(),
    color: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
  }),
});

export const updateGoalStatusSchema = z.object({
  body: z.object({
    status: z.enum([GoalStatus.ACTIVE, GoalStatus.COMPLETED, GoalStatus.FAILED, GoalStatus.CANCELLED, GoalStatus.ARCHIVED]),
  }),
});
