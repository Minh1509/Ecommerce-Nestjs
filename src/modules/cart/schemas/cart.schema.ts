import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
class CartProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;
}
const CartProductSchema = SchemaFactory.createForClass(CartProduct)
CartProductSchema.set('_id', false);

@Schema({collection: 'carts', timestamps: true})
export class Cart {

  @Prop({type: String, enum: ['active', 'completed', 'failed', 'pending'], default: 'actve' })
  cart_state: string

  @Prop({type: [CartProductSchema],  default: []})
  cart_products : CartProduct[]

  @Prop({type: Number, default: 0})
  cart_count_product: number

  @Prop({type: Types.ObjectId, required: true})
  cart_userId: Types.ObjectId
}

export type CartDocument = HydratedDocument<Cart>
export const CartSchema = SchemaFactory.createForClass(Cart)
