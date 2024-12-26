import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsDate, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDiscountDto {

  @ApiProperty({description: "Discount code"})
  @IsString()
  discount_code: string

  @ApiProperty({ description: 'Tên dícount' })
  @IsString()
  discount_name: string;

  @ApiProperty({ description: 'Discount theo phần trăm hoặc cố định', enum: ['percentage', 'fixed'] })
  @IsEnum(['percentage', 'fixed'])
  discount_type: string;

  @ApiProperty({ description: 'Phần trăm hoặc số tiền giảm giá' })
  @IsNumber()
  discount_value: number;

  @ApiProperty({ description: 'The start date of the discount.' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  discount_startDate: Date;

  @ApiProperty({ description: 'The end date of the discount.' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  discount_endDate: Date;

  @ApiProperty({ description: 'Số tiền giảm giá tối đa ' })
  @IsNumber()
  discount_max_uses: number;

  @ApiProperty({required: true })
  @IsBoolean()
  discount_isActive: boolean;

  @ApiProperty({ description: 'Min áp dụng' })
  @IsNumber()
  discount_min_order_value: number;

  @ApiProperty({ description: 'Áp dụng cho user_rank', enum: ['member', 'gold', 'silver', 'diamond']})
  @IsString()
  @IsEnum(['member', 'gold', 'silver', 'diamond'], { each: true })
  discount_apply_to: string

  @ApiProperty({ description: 'Áp dụng cho product_id', required: false })
  @IsArray()
  @IsOptional()
  discount_productIds: string[];
}
