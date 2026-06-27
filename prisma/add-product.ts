import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env") });

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const newProducts = [
  {
    slug: "broche-bandeira",
    name: "Broche Bandeira",
    category: "Broche",
    eyebrow: "Copa 2026",
    tagline: "A bandeira no peito, o Brasil no coração.",
    blurb: "Broche artesanal com a bandeira do Brasil em resina e miçangas — feito à mão, peça por peça. Pra quem vai ao jogo ou assiste em casa com todo o estilo.",
    details: "Resina e miçangas · bordado à mão · fixação com alfinete seguro · peça única artesanal",
    hero: "/images/broche-bandeira-1.jpg",
    heroPosition: "center 40%",
    thumbnail: "/images/broche-bandeira-3.jpg",
    images: [
      "/images/broche-bandeira-1.jpg",
      "/images/broche-bandeira-2.jpg",
      "/images/broche-bandeira-3.jpg",
      "/images/broche-bandeira-4.jpg",
      "/images/broche-bandeira-5.jpg",
    ],
    price: 3000, // R$ 30,00 em centavos
    sizes: ["Único"],
    weight: 50, width: 5, height: 1, length: 5,
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida no .env");

  const adapter = new PrismaNeon({ connectionString: url });
  const prisma = new PrismaClient({ adapter } as never);

  for (const p of newProducts) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`  ⚠ "${p.name}" já existe (slug: ${p.slug}) — pulando`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        eyebrow: p.eyebrow,
        tagline: p.tagline,
        blurb: p.blurb,
        details: p.details,
        hero: p.hero,
        heroPosition: p.heroPosition ?? null,
        heroExclude: true,
        thumbnail: p.thumbnail ?? null,
        images: p.images,
        status: "ACTIVE",
      },
    });

    const attribute = await prisma.productAttribute.create({
      data: { name: "Tamanho", productId: product.id },
    });

    for (const size of p.sizes) {
      const attrValue = await prisma.attributeValue.create({
        data: { value: size, attributeId: attribute.id },
      });
      await prisma.productVariant.create({
        data: {
          sku: `${p.slug}-${size.toLowerCase().replace(/\s/g, "-")}`,
          price: p.price,
          stock: 10,
          images: [],
          weight: p.weight,
          width: p.width,
          height: p.height,
          length: p.length,
          productId: product.id,
          attributeValues: { connect: { id: attrValue.id } },
        },
      });
    }

    console.log(`  ✓ ${p.name} (R$ ${(p.price / 100).toFixed(2)})`);
  }

  console.log("\nConcluído. Pedidos intactos.");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
