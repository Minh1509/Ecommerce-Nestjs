import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({collection : 'discounts', timestamps: true})
export class Discount {

  @Prop({type: String, required: true})
  discount_code: string

  @Prop({type: String, required: true})
  discount_name :string

  @Prop({ type: String, enum: ['percentage', 'fixed'], required: true })
  discount_type: string;


  @Prop({type: Number, required: true})
  discount_value: number

  @Prop({type: Date, required: true})
  discount_startDate : Date

  @Prop({type: Date, required: true})
  discount_endDate: Date

  @Prop({ type: Number, required: true})
  discount_max_uses: number;

  @Prop({ type: Boolean, default: true })
  discount_isActive: boolean;

  @Prop({ type: Number, required: true })
  discount_min_order_value: number;

  @Prop({type: String, enum : ['member', 'gold', 'silver', 'diamond'], required: true})
  discount_apply_to: string

  @Prop({type: Array, default: []})
  discount_productIds : string[]

}

export type DiscountDocument = HydratedDocument<Discount>
export const DiscountSchema = SchemaFactory.createForClass(Discount)
