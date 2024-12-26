import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({required: false})
  @IsString()
  name: string;

  @ApiProperty({required: false})
  @IsString()
  description: string

  @ApiProperty({required: false})
  @IsNumber()
  price: number;

  @ApiProperty({required: false})
  @IsNumber()
  quantity: number
}
