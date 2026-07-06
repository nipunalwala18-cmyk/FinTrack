import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name must be at least 1 character')
      .max(50, 'Name must be at most 50 characters'),
    type: z.enum(['INCOME', 'EXPENSE']),
    color: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    parentId: z.string().optional().nullable(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name must be at least 1 character')
      .max(50, 'Name must be at most 50 characters')
      .optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    color: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    parentId: z.string().optional().nullable(),
  }),
});

export const reorderCategoriesSchema = z.object({
  body: z.object({
    categories: z.array(
      z.object({
        id: z.string(),
        sortOrder: z.number().int('Sort order must be an integer'),
        parentId: z.string().nullable().optional(),
      })
    ),
  }),
});
