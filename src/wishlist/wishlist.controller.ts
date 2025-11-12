import { Controller, Get, Post, Delete, Query, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddToWishlistDto } from './dto';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private svc: WishlistService) {}

  @Get()
  list(@Req() req: any) {
    const userId = req.user.userId as number;
    return this.svc.listByUser(userId);
  }

  @Post()
  add(@Body() body: AddToWishlistDto, @Req() req: any) {
    const userId = req.user.userId as number;
    return this.svc.add(userId, body.productId);
  }

  // delete by wishlist row id (used by list page)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId as number;
    return this.svc.remove(id, userId);
  }

  // convenience: delete by product (used by heart toggle)
  @Delete()
  removeByProduct(@Query('productId') productId: string, @Req() req: any) {
    const userId = req.user.userId as number;
    return this.svc.removeByProduct(userId, Number(productId));
  }
}
