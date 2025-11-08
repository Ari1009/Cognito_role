import { IsString, IsNumber, IsArray, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsString()
  productImage: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  total: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  @IsOptional()
  deliveryCharge?: number;

  @IsNumber()
  totalAmount: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  postCode: string;

  @IsString()
  country: string;

  @IsString()
  regionState: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  shippingMethod?: string;
}
