import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ListProductsDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  async list(@Query() dto: ListProductsDto) {
    return this.products.list(dto);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.products.getById(id);
  }
}
