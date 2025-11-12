import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  listByUser(userId: number) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(userId: number, productId: number) {
    // ensure product exists (nicer error than FK)
    const exists = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!exists) throw new NotFoundException('Product not found');

    return this.prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: {}, // already there — idempotent
      create: { userId, productId },
    });
  }

  async remove(id: number, userId: number) {
    // small safety check to avoid deleting others’ items
    const item = await this.prisma.wishlistItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Wishlist item not found');
    return this.prisma.wishlistItem.delete({ where: { id } });
  }

  async removeByProduct(userId: number, productId: number) {
    const it = await this.prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!it) throw new NotFoundException('Wishlist item not found');
    return this.prisma.wishlistItem.delete({ where: { id: it.id } });
  }
}
