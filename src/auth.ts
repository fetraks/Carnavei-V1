import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "./auth.config";

// Config completa (Node runtime): adapter Prisma + sessão JWT.
// Usamos strategy "jwt" para que o middleware (Edge) consiga ler a sessão
// sem tocar no banco. O adapter continua persistindo User/Account no Neon
// para vincular as contas sociais (Google/Facebook) ao mesmo usuário.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    // Preserva o `authorized` definido em auth.config.ts (usado no middleware)...
    ...authConfig.callbacks,
    // ...e adiciona a propagação de id e role: do usuário para o token...
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // ...e do token para a sessão (server components e middleware).
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CUSTOMER" | "ADMIN";
      }
      return session;
    },
  },
});
