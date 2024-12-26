import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApiBearerAuth } from '@nestjs/swagger';



@ApiBearerAuth("Authorization")
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}


  @Post('createDiscount')
  async createDiscount(@Body() createDiscountDto :CreateDiscountDto)  {
    return await this.discountService.createDiscount(createDiscountDto)
  }

}
