import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req.user.userId as number;
    return this.ordersService.create(userId, dto);
  }

  @Get()
  async list(@Req() req: any, @Query('page') page = '1', @Query('limit') limit = '20') {
    const userId = req.user.userId as number;
    return this.ordersService.list(userId, Number(page), Number(limit));
  }

  @Get(':orderId')
  async getByOrderId(@Param('orderId') orderId: string, @Req() req: any) {
    const userId = req.user.userId as number;
    return this.ordersService.getByOrderId(orderId, userId);
  }
}
