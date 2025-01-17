import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { DiscountRepositoty } from './discount.repositoty';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './schemas/discount.schema';

@Module({

  imports: [MongooseModule.forFeature([{name: Discount.name, schema: DiscountSchema}])],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepositoty],
})
export class DiscountModule {}
