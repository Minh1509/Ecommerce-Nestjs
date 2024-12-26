import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Discount, DiscountDocument } from './schemas/discount.schema';
import { Model } from 'mongoose';
import { DiscountRepositoty } from './discount.repositoty';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<DiscountDocument>,
    private readonly  discountRepositoty: DiscountRepositoty
  ) {}

  // create discount
  async createDiscount(createDiscountDto: CreateDiscountDto) {
    const {discount_code, discount_startDate, discount_endDate , discount_isActive, discount_apply_to} = createDiscountDto

    const foundDiscount = await this.discountModel.findOne({discount_code,discount_apply_to });

    // TH cả stateDate và endDate đều đã qua
    if(new Date() < new Date(discount_startDate)  || new Date() > new Date(discount_endDate)){
        throw new BadRequestException("Discount expired")
    }

    if(new Date(discount_startDate) > new Date(discount_endDate)) {
      throw new BadRequestException("stateDate must before endDate")
    }

    if(foundDiscount && discount_isActive) throw new BadRequestException("Discount exit");

    return await this.discountModel.create(createDiscountDto)

  }
}
