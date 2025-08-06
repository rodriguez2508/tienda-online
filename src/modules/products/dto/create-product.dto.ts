import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsInt } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Laptop Pro X1',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the product',
    example: 'A powerful laptop for professionals.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 1499.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  @IsString()
  category: string;
}