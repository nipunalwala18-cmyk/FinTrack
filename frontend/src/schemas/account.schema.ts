import { z } from 'zod';

export const createAccountSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(40, 'Name must be at most 40 characters'),
    type: z.enum(['BANK', 'CASH', 'CREDIT_CARD', 'INVESTMENT', 'E_WALLET'] as const),
    balance: z.number({ invalid_type_error: 'Balance/Investment must be a number' }).min(0, 'Balance/Investment must be greater than or equal to 0'),
    currency: z.string().default('INR'),
    color: z.string().default('#2563EB'),
    icon: z.string().default('landmark'),

    // Extended fields
    accountNumber: z.string().optional().nullable(),
    branch: z.string().optional().nullable(),

    creditLimit: z.number().optional().nullable(),
    outstandingBalance: z.number().optional().nullable(),
    billingDay: z.number().min(1, 'Billing Day must be between 1 and 31').max(31, 'Billing Day must be between 1 and 31').optional().nullable(),
    paymentDueDay: z.number().min(1, 'Due Day must be between 1 and 31').max(31, 'Due Day must be between 1 and 31').optional().nullable(),

    provider: z.string().optional().nullable(),

    interestRate: z.number().min(0, 'Return rate must be between 0% and 20%').max(20, 'Return rate must be between 0% and 20%').optional().nullable(),
    investmentDuration: z.number().positive('Duration must be greater than 0').optional().nullable(),

    notes: z.string().optional().nullable(),
    includeInNetWorth: z.boolean().default(true),
    displayOrder: z.number().int().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === 'CREDIT_CARD') {
        const limit = data.creditLimit ?? 0;
        const outstanding = data.outstandingBalance ?? 0;
        return outstanding <= limit;
      }
      return true;
    },
    {
      message: 'Outstanding balance must not exceed Credit Limit',
      path: ['outstandingBalance'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'E_WALLET' && (!data.provider || data.provider.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Provider is required for E-Wallets',
      path: ['provider'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'INVESTMENT' && (!data.investmentDuration || data.investmentDuration <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Investment duration must be greater than 0',
      path: ['investmentDuration'],
    }
  );

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
