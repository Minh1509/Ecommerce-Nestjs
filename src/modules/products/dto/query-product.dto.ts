import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class QueryProductDto {

  @IsOptional()
  @ApiProperty({required: false})
  @IsString()
  keySearch : string

  @ApiProperty({required: false})
  @IsOptional()
  limit: number

  @ApiProperty({required: false})
  @IsOptional()
  page: number


}
