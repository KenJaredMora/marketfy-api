import { Controller, Get, Post, Delete, Query, Body, Param, ParseIntPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private svc: WishlistService) {}

  @Get()
  list(@Query('userId') userId: string) {
    return this.svc.listByUser(Number(userId || 1));
  }

  @Post()
  add(@Body() body: { userId: number; productId: number }) {
    return this.svc.add(Number(body.userId), Number(body.productId));
  }

  // delete by wishlist row id (used by list page)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Query('userId') userId: string) {
    return this.svc.remove(id, Number(userId || 1));
  }

  // convenience: delete by product (used by heart toggle)
  @Delete()
  removeByProduct(@Query('userId') userId: string, @Query('productId') productId: string) {
    return this.svc.removeByProduct(Number(userId || 1), Number(productId));
  }
}
