import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { accounts, users, verificationTokens } from '@/server/db/schema';
import * as bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { registerSchema } from '@/model/auth';
import type { AdapterAccount } from 'next-auth/adapters';
import { v4 as uuid } from 'uuid';
import { Resend } from 'resend';
import { verifyEmailSchema } from '@/model/auth';
import { eq } from 'drizzle-orm';

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const existing = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, input.email),
      });
      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already registered',
        });
      }
      const hashed = await bcrypt.hash(input.password, 10);
      const [user] = await db
        .insert(users)
        .values({
          email: input.email,
          name: input.name,
          password: hashed,
          emailVerified: null,
        })
        .returning();

      if (user) {
        await db.insert(accounts).values({
          userId: user.id,
          type: 'credentials' as AdapterAccount['type'],
          provider: 'credentials',
          providerAccountId: input.email,
        });
        const token = uuid();

        await db.insert(verificationTokens).values({
          identifier: input.email,
          token,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //24h,
        });
        const resend = new Resend(process.env.RESEND_API_KEY);

        const link = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/auth/verify-email?token=${token}`;

        const result = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: input.email,
          subject: 'Verify your email',
          html: `
            <h2>Welcome to Kanban!</h2>
            <p>To activate your account, click the button below:</p>
            <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;">Verify Email</a>
            <p>Or copy and paste this link into your browser:<br/><code>${link}</code></p>
            <p>If you did not create this account, please ignore this email.</p>
          `,
        });
      }

      return { success: true };
    }),
  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ input }) => {
      const verificationToken = await db.query.verificationTokens.findFirst({
        where: (u, { eq }) => eq(u.token, input.token),
      });
      if (verificationToken) {
        await db
          .update(users)
          .set({
            emailVerified: new Date(),
          })
          .where(eq(users.email, verificationToken.identifier));
      }
    }),
});
