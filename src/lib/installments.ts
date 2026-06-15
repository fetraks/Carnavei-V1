import { maxInstallments } from "@/lib/products";

export type InstallmentInfo = { n: number; amount: number } | null;

// Consulta o parcelamento REAL do Mercado Pago (com juros já aplicados) para um
// valor. Usa "master" como bandeira de referência (Visa/Master têm as mesmas
// taxas nesta conta). Cacheado por 12h — as taxas raramente mudam.
// O valor é baseado no preço do produto (sem frete); no checkout o MP mostra
// o valor exato incluindo o frete.
export async function getInstallment(priceReais: number): Promise<InstallmentInfo> {
  const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
  if (!pk) return null;
  const maxN = maxInstallments(priceReais);

  try {
    const url =
      `https://api.mercadopago.com/v1/payment_methods/installments` +
      `?amount=${priceReais}&payment_method_id=master&locale=pt-BR&public_key=${pk}`;
    const res = await fetch(url, { next: { revalidate: 43200 } });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      payer_costs: Array<{ installments: number; installment_amount: number }>;
    }>;
    const costs = data?.[0]?.payer_costs ?? [];
    // maior número de parcelas permitido pela nossa regra (<= maxN)
    const pc = costs
      .filter((c) => c.installments <= maxN)
      .sort((a, b) => b.installments - a.installments)[0];
    return pc ? { n: pc.installments, amount: pc.installment_amount } : null;
  } catch {
    return null;
  }
}

export function installmentLabel(info: InstallmentInfo): string | null {
  if (!info) return null;
  const amount = info.amount.toFixed(2).replace(".", ",");
  return `ou ${info.n}× de R$ ${amount} no cartão`;
}
