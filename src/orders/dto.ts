import { IsArray, IsNumber } from 'class-validator';
export class CreateOrderDto {
  @IsNumber() userId!: number;
  @IsArray()  items!: any[];
  @IsNumber() total!: number;
}
