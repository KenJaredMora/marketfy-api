import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(
    @Body() body: { items: any[]; total: number },
    @Req() req: any,
  ) {
    const userId = req.user.userId as number;
    const orderId = randomUUID();
    return this.prisma.order.create({
      data: {
        orderId,
        userId,
        items: body.items as any,
        total: body.total,
      },
    });
  }

  @Get()
  async list(@Req() req: any, @Query('page') page = '1', @Query('limit') limit = '20') {
    const userId = req.user.userId as number;
    const p = Math.max(1, Number(page));
    const l = Math.min(50, Math.max(1, Number(limit)));
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

  @Get(':orderId')
  async getByOrderId(@Param('orderId') orderId: string, @Req() req: any) {
    const userId = req.user.userId as number;
    const order = await this.prisma.order.findUnique({ where: { orderId } });
    if (!order || order.userId !== userId) return null; // or throw ForbiddenException
    return order;
  }
}
