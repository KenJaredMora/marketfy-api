import { Body, Controller, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user.userId as number;
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  @Patch('me')
  async patch(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId as number;
    const { interests, ...rest } = body;
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...rest,
        interests: Array.isArray(interests) ? interests : [],
      },
    });
  }
}
