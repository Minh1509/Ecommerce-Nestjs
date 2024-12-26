
import {

  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCartDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number


}
