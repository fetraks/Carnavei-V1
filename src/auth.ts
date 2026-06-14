import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import authConfig from "./auth.config";

// Provider de e-mail/senha. Fica aqui (não em auth.config.ts) porque o
// `authorize` toca o banco e o bcrypt — não pode rodar no Edge (middleware).
const credentials = Credentials({
  credentials: { email: {}, password: {} },
  authorize: async (creds) => {
    const email = String(creds?.email ?? "").toLowerCase().trim();
    const password = String(creds?.password ?? "");
    if (!email || !password) return null;

    const user = await db.user.findUnique({ where: { email } });
    // Sem senha = conta criada via Google (social) — não loga por senha.
    if (!user?.password) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    };
  },
});

// Config completa (Node runtime): adapter Prisma + sessão JWT.
// Usamos strategy "jwt" para que o middleware (Edge) consiga ler a sessão
// sem tocar no banco. O adapter continua persistindo User/Account no Neon
// para vincular as contas sociais (Google/Facebook) ao mesmo usuário.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  // Google (do authConfig, Edge-safe) + Credentials (e-mail/senha, Node).
  providers: [...authConfig.providers, credentials],
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
