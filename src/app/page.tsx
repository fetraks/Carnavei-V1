import type { Metadata } from "next";
import { StorefrontApp } from "@/components/store/StorefrontApp";
import { getProducts } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { getInstallment, installmentLabel } from "@/lib/installments";
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

  // Parcelamento real (MP) por produto, para exibir "ou Nx de R$Y" na vitrine
  const installments = Object.fromEntries(
    await Promise.all(
      products.map(async (p) => [p.id, installmentLabel(await getInstallment(p.price))])
    )
  ) as Record<string, string | null>;

  return (
    <StorefrontApp
      products={products}
      initialCart={session.cart ?? []}
      user={user}
      installments={installments}
    />
  );
}
