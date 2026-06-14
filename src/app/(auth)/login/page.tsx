import Link from "next/link";
import Image from "next/image";
import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Entrar · Carnavei" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  // Já logado → manda pra conta (ou pro destino solicitado)
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) redirect(callbackUrl ?? "/conta");

  const redirectTo = callbackUrl ?? "/conta";

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="mb-10">
        <Image
          src="/carnavei-wordmark.svg"
          alt="Carnavei"
          width={140}
          height={36}
          className="h-9 w-auto"
          priority
        />
      </Link>

      <h1 className="font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)] mb-2">
        Entrar
      </h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8 max-w-xs">
        Acesse sua conta para acompanhar seus pedidos. É rápido — use uma conta
        que você já tem.
      </p>

      <div className="w-full max-w-xs space-y-3">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-[var(--line)] bg-white text-[var(--ink)] text-sm font-semibold hover:bg-[var(--paper)] transition-colors"
          >
            <GoogleIcon /> Entrar com Google
          </button>
        </form>

        <form
          action={async () => {
            "use server";
            await signIn("facebook", { redirectTo });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full bg-[#1877F2] text-white text-sm font-semibold hover:bg-[#0f66d8] transition-colors"
          >
            <FacebookIcon /> Entrar com Facebook
          </button>
        </form>
      </div>

      <p className="text-xs text-[var(--ink-faint)] mt-8 max-w-xs">
        Você não precisa de conta para comprar. O login serve para acompanhar
        seus pedidos.
      </p>

      <Link
        href="/"
        className="text-sm text-[var(--terracotta)] underline underline-offset-4 mt-6"
      >
        Voltar à loja
      </Link>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8v8.44C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}
