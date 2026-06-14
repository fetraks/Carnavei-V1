"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error?: string } | null;

export async function loginWithPassword(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/conta",
    });
  } catch (err) {
    // signIn lança NEXT_REDIRECT em caso de sucesso — esse precisa propagar.
    if (err instanceof AuthError) {
      return { error: "E-mail ou senha incorretos." };
    }
    throw err;
  }
  return null;
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/conta" });
}
