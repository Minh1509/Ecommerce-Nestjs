import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument } from 'mongoose';

@Schema({ collection: 'otp_logs', timestamps: true })
export class Otp {
  @Prop({ type: String, required: true })
  otp_token: string;

  @Prop({ type: String, required: true })
  otp_email: string;

  @Prop({
    type: String,
    default: 'pending',
    enum: ['pending', 'active', 'block'],
  })
  otp_status: string;

  @Prop({
    type: Date,
    default: Date.now,
    expires: 120,
  })
  expireAt: Date;
}

export type OtpDocument = HydratedDocument<Otp>;
export const OtpSchema = SchemaFactory.createForClass(Otp);
