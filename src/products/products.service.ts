import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ListProductsDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list(dto: ListProductsDto) {
    const { q, tag, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = dto;

    // Build where clause for search and filters
    const where: Prisma.ProductWhereInput = {};
    const orConditions: Prisma.ProductWhereInput[] = [];

    if (q) {
      orConditions.push(
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { hasSome: q.toLowerCase().split(' ') } },
      );
    }

    if (tag) {
      where.tags = { has: tag.toLowerCase() };
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
