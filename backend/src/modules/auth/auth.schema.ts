import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().nonempty('Password is required'),
  }),
});

export const refreshSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().nonempty('Refresh token is required in cookie'),
  }).catchall(z.any()),
}).passthrough();
