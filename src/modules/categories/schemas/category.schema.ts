import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'categories', timestamps: true })
export class Category {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({type: String, required: true})
  description: string

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  productIds: Types.ObjectId[];
}
export type CategoryDocument = HydratedDocument<Category>
export const CategorySchema = SchemaFactory.createForClass(Category)
