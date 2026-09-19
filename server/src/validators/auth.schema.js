import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(24, 'Username must be at most 24 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

// "identifier" can be either the user's email or their username — the
// controller figures out which one it is and looks up the user accordingly.
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1),
});
