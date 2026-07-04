import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(40, 'Name must be at most 40 characters'),
    type: z.enum(['BANK', 'CASH', 'CREDIT_CARD', 'INVESTMENT', 'E_WALLET']),
    balance: z.number().min(0, 'Balance must be greater than or equal to 0'),
    currency: z.string().default('INR'),
    color: z.string().optional(),
    icon: z.string().optional(),
    
    // Extended fields
    accountNumber: z.string().optional().nullable(),
    branch: z.string().optional().nullable(),
    
    creditLimit: z.number().optional().nullable(),
    outstandingBalance: z.number().optional().nullable(),
    billingDay: z.number().min(1).max(31).optional().nullable(),
    paymentDueDay: z.number().min(1).max(31).optional().nullable(),
    
    provider: z.string().optional().nullable(),
    
    interestRate: z.number().min(0).max(20).optional().nullable(),
    investmentDuration: z.number().positive().optional().nullable(),
    
    notes: z.string().optional().nullable(),
    includeInNetWorth: z.boolean().default(true),
    displayOrder: z.number().int().optional().nullable(),
  }),
});
