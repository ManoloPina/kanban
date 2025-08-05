'use server';

import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import * as bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { registerSchema, type RegisterFormState } from '@/model/auth';
import { api } from '@/trpc/server';

export async function registerUser(
  prevState: unknown,
  formData: FormData,
): Promise<RegisterFormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirm = formData.get('confirm') as string;

  console.log({
    password,
    confirm,
  });

  const validation = registerSchema.safeParse({
    name,
    email,
    password,
    confirm,
  });

  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors, success: false };
  }

  const { success } = await api.auth.register({
    email,
    password,
    confirm,
    name,
  });

  revalidatePath('/auth/sign-in');
  return { errors: {}, success };
}
