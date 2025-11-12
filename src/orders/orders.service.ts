import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    const orderId = randomUUID();

    return this.prisma.order.create({
      data: {
        orderId,
        userId,
        items: dto.items as any,
        total: dto.total,
      },
    });
  }

  async list(userId: number, page: number = 1, limit: number = 20) {
    const p = Math.max(1, page);
    const l = Math.min(50, Math.max(1, limit));

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (p - 1) * l,
        take: l,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { data, total, page: p, limit: l };
  }

  async getByOrderId(orderId: string, userId: number) {
    // First, try to find the order
    const order = await this.prisma.order.findFirst({
      where: {
        orderId: orderId,
        userId: userId, // Only search in user's own orders
      },
    });

    if (!order) {
      // Check if order exists but belongs to another user
      const orderExists = await this.prisma.order.findUnique({
        where: { orderId },
        select: { id: true },
      });

      if (orderExists) {
        throw new ForbiddenException('You do not have access to this order');
      }

      throw new NotFoundException(`Order with ID ${orderId} not found. Make sure the order was created through the API.`);
    }

    return order;
  }
}
