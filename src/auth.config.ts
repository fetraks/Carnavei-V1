import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
// Facebook: reativar quando o app no Meta for Developers for aprovado.
// import Facebook from "next-auth/providers/facebook";

// Config "Edge-safe": SEM Prisma adapter e SEM acesso ao banco.
// É a parte da config que o middleware (Edge runtime) consegue carregar.
// O adapter e os callbacks que tocam o banco ficam em `auth.ts` (Node).
// Auth.js v5 detecta automaticamente as env AUTH_GOOGLE_ID/SECRET e
// AUTH_FACEBOOK_ID/SECRET — por isso os providers não recebem args.
export default {
  // Passados explicitamente: o auto-detect de AUTH_SECRET não roda de forma
  // confiável no Edge/Turbopack (middleware). trustHost é necessário em
  // self-hosted/dev para o Auth.js confiar no host do request.
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  // Credentials (e-mail/senha) é adicionado em auth.ts (precisa do banco, não é Edge-safe).
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Propaga id e role do token para a sessão — necessário aqui para que o
    // middleware (que usa só authConfig) consiga ler session.user.role.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CUSTOMER" | "ADMIN";
      }
      return session;
    },
    // Protege rotas no middleware. Retornar false/redirect bloqueia o acesso.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) {
        return isLoggedIn && role === "ADMIN";
      }
      if (path.startsWith("/conta")) {
        return isLoggedIn;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
