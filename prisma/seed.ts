// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // ✅ namespace import works with CJS ts-node
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@marketfy.test';
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1) Demo user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      displayName: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      interests: ['tech', 'home', 'gaming'],
    },
  });

  // 2) Seed products (30)
  const count = await prisma.product.count();
  if (count === 0) {
    const products: Prisma.ProductCreateManyInput[] = Array.from({ length: 30 }).map((_, i) => ({
      name: `Product #${i + 1}`,
      // Prisma Decimal-safe: pass as number
      price: Number((Math.random() * 100 + 5).toFixed(2)),
      imageUrl: `https://picsum.photos/seed/marketfy-${i}/400/300`,
      tags: i % 2 === 0 ? ['tech'] : ['home'],
      description: 'Sample description for product ' + (i + 1),
    }));
    await prisma.product.createMany({ data: products });
  }

  // 3) Example order
  const prods = await prisma.product.findMany({ take: 2 });
  if (prods.length >= 2) {
    // Convert Prisma Decimal -> number for arithmetic
    const p0 = Number(prods[0].price);
    const p1 = Number(prods[1].price);
    const total = p0 * 1 + p1 * 2;

    await prisma.order.upsert({
      where: { orderId: 'SAMPLE-ORDER' }, // keep a fixed sample if you want
      update: {},
      create: {
        orderId: randomUUID(),
        userId: user.id,
        // Keep a compact item shape (don’t dump full product object)
        items: [
          { product: { id: prods[0].id, name: prods[0].name, price: p0 }, qty: 1 },
          { product: { id: prods[1].id, name: prods[1].name, price: p1 }, qty: 2 },
        ],
        // Pass total as number
        total: Number(total.toFixed(2)),
      },
    });
  }

  console.log('Seed done.');
}

main().finally(() => prisma.$disconnect());
