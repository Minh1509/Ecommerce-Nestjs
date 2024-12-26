import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class AddCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: string

  @ApiProperty()
  @IsNotEmpty()
  categoryId: string


}
