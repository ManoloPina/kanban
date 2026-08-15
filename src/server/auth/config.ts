import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { type DefaultSession, type NextAuthConfig, type User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/server/db';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { encode as defaultEncode } from 'next-auth/jwt';

import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from '@/server/db/schema';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const user = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.email, email),
        });
        if (!user) return null;
        if (!user.emailVerified) {
          throw new Error('You must verify your email before logging in.');
        }
        const password = credentials.password as string;
        const valid = await bcrypt.compare(password, user.password ?? '');
        console.log('Senha válida?', valid);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name } as User;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Refer to the NextAuth.js docs for the provider you want to use.
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'credentials') {
        token.credentials = true;
      }
      return token;
    },
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user?.id ?? session.user.id,
        },
      };
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error('No user ID found in token');
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!createdSession) {
          throw new Error('Failed to create session');
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;
