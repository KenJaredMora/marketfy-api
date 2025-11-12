import { Body, Controller, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user.userId as number;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    // Exclude passwordHash from response
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Patch('me')
  async patch(@Req() req: any, @Body() body: UpdateUserDto) {
    const userId = req.user.userId as number;
    const updateData: any = {};

    if (body.displayName !== undefined) updateData.displayName = body.displayName;
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.interests !== undefined) updateData.interests = body.interests;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Exclude passwordHash from response
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
