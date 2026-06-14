import type { DefaultSession } from "next-auth";

type UserRole = "CUSTOMER" | "ADMIN";

// Aumenta os tipos do Auth.js para carregar id e role do usuário.
declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
