import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({required: false})
  @IsString()
  name: string

  @ApiProperty({required: false})
  @IsString()
  description: string


}
