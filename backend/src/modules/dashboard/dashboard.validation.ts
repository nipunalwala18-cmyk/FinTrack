import { z } from 'zod';

// Validation schema for GET /dashboard (currently no query or body parameters, left open for future expansion)
export const getDashboardSchema = z.object({
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});
