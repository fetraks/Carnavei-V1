import type { Metadata } from "next";
import { StorefrontApp } from "@/components/store/StorefrontApp";
import { getProducts } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Carnavei — Acessórios Artesanais",
  description: "Acessórios artesanais femininos feitos à mão. Cada peça é única.",
};

export default async function Page() {
  const [products, session, authSession] = await Promise.all([
    getProducts(),
    getSession(),
    auth(),
  ]);
  const user = authSession?.user
    ? { name: authSession.user.name, image: authSession.user.image }
    : null;
  return (
    <StorefrontApp products={products} initialCart={session.cart ?? []} user={user} />
  );
}
