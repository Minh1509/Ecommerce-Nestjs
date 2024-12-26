import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  usr_name: string;

  @Prop({ type: String, default: '' })
  usr_password: string;

  @Prop({ type: String, required: true })
  usr_email: string;

  @Prop({ type: Date, required: true })
  usr_date_of_birth: Date;

  @Prop({type: String, enum: ['member','silver', 'gold', 'diamond'], default: 'member'})
  usr_rank : string

  @Prop({type: [String], enum : ['user' , 'admin'], default: ['user']})
  usr_roles: string[]

  @Prop({
    type: String,
    default: 'pending',
    enum: ['pending', 'active', 'block'],
  })
  usr_status: string
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
