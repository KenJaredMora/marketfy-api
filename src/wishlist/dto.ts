import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddToWishlistDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  // Frontend might send this, but we'll use JWT userId instead
  @IsOptional()
  @IsNumber()
  userId?: number;
}
