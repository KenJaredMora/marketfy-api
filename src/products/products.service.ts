import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async list({ q, page, limit }: { q: string; page: number; limit: number }) {
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as Prisma.QueryMode } },
            { tags: { has: q } }, // works with String[] tags
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  getById(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }
}
