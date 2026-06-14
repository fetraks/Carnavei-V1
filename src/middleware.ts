import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Middleware usa só a config Edge-safe (sem Prisma adapter).
// O callback `authorized` em auth.config.ts decide o acesso a /conta e /admin.
export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  // O retorno do callback `authorized` já trata o bloqueio/redirect.
  // Nada a fazer aqui — a presença do middleware ativa a proteção.
  void req;
});

export const config = {
  // Protege apenas as áreas privadas; evita rodar em assets e na API.
  matcher: ["/conta/:path*", "/admin/:path*"],
};
