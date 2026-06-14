import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = { title: "Pedidos · Admin Carnavei" };

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aguardando",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

function brl(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

export default async function AdminPedidosPage() {
  const session = await auth();
  // Defesa em profundidade: o middleware já barra, mas validamos de novo aqui.
  if (!session?.user) redirect("/login?callbackUrl=/admin/pedidos");
  if (session.user.role !== "ADMIN") redirect("/");

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  const totalVendido = orders
    .filter((o) => o.status === "PAID" || o.status === "SHIPPED" || o.status === "DELIVERED")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-[family-name:var(--font-heading)] text-xl text-[var(--ink)]">
            Carnavei · Admin
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] underline underline-offset-4">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--ink)]">
            Pedidos
          </h1>
          <div className="text-right">
            <p className="text-xs text-[var(--ink-faint)]">Total vendido (pago+)</p>
            <p className="text-lg font-bold text-[var(--terracotta)]">{brl(totalVendido)}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="text-[var(--ink-soft)]">Nenhum pedido ainda.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-left text-[var(--ink-faint)]">
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Pedido</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Itens</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-[var(--line)] last:border-0 align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--ink-soft)]">
                      {o.createdAt.toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-[var(--ink-soft)]">
                      #{o.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[var(--ink)]">{o.customerName}</p>
                      <p className="text-xs text-[var(--ink-faint)]">{o.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--ink-soft)]">
                      {o.items.map((it) => (
                        <div key={it.id}>{it.variant.product.name} ×{it.quantity}</div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--blush)]/40 text-[var(--ink)] whitespace-nowrap">
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[var(--ink)] whitespace-nowrap">
                      {brl(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
