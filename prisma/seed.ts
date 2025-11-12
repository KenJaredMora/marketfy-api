import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();


async function main() {
  const email = 'demo@marketfy.test';
  const passwordHash = await bcrypt.hash('password123', 10);

  // Usuario demo
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

  // Productos (30 aprox.)
  const count = await prisma.product.count();
  if (count === 0) {
    const products = Array.from({ length: 30 }).map((_, i) => ({
      name: `Product #${i + 1}`,
      price: Number((Math.random() * 100 + 5).toFixed(2)),
      imageUrl: `https://picsum.photos/seed/marketfy-${i}/400/300`,
      tags: i % 2 === 0 ? ['tech'] : ['home'],
      description: 'Sample description for product ' + (i + 1),
    }));
    await prisma.product.createMany({ data: products });
  }

  // Un pedido de ejemplo (opcional)
  const prods = await prisma.product.findMany({ take: 2 });
  if (prods.length >= 2) {
    await prisma.order.upsert({
      where: { orderId: 'SAMPLE-ORDER' },
      update: {},
      create: {
        orderId: randomUUID(),
        userId: user.id,
        items: [
          { product: prods[0], qty: 1 },
          { product: prods[1], qty: 2 },
        ] as any,
        total: prods[0].price * 1 + prods[1].price * 2,
      },
    });
  }

  console.log('Seed done.');
}

main().finally(() => prisma.$disconnect());
