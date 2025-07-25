export { auth as middleware } from '@/server/auth';

export const config = {
  matcher: [
    /*
      Protege todas as rotas, exceto:
      - /api
      - /_next
      - /static
      - /auth/login
    */
    '/((?!api|_next|static|auth/login).*)',
  ],
};
