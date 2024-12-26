import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({collection: 'products', timestamps: true})
export class Product {
  @Prop({type: String, required: true})
  name: string

  @Prop({type: String, required: true})
  description: string

  @Prop({type: Number, required: true})
  price: number

  @Prop({type: Number, required: true})
  quantity: number

  @Prop({type: String})
  thumb: string
  @Prop({type: [Types.ObjectId], ref: 'Category',  default: []})
  categoryIds: Types.ObjectId[]
}

export type ProductDocument = HydratedDocument<Product>
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({name: 'text', description: 'text'})