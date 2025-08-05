import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(3).max(50).nonempty(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Password do not match',
    path: ['confirm'],
  });

export const verifyEmailSchema = z.object({
  token: z.string().uuid(),
});

export type RegisterFormState = {
  errors: z.inferFlattenedErrors<typeof registerSchema>['fieldErrors'] & {
    _form?: string[];
  };
  success: boolean;
};

export type RegisterReq = z.infer<typeof registerSchema>;
export type LoginReq = z.infer<typeof loginSchema>;
