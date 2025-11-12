import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '12', @Query('q') q = '') {
    const p = Math.max(1, Number(page));
    const l = Math.min(50, Math.max(1, Number(limit)));
    return this.products.list({ q, page: p, limit: l });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.products.getById(Number(id));
  }
}
