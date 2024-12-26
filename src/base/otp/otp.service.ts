import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import * as crypto from 'node:crypto';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<OtpDocument>) {}

  async generateTokenRandom() {
    const token = crypto.randomInt(0, Math.pow(2, 32));
    return token;
  }

  async newOtp({email}) {
    const token = await this.generateTokenRandom();
    console.log(token);
    const newToken = await this.otpModel.create({
      otp_token : token,
      otp_email: email,
    })
    return newToken
  }

  async checkEmailToken({ token }: { token: string }) {
    const hasToken = await this.otpModel.findOne({ otp_token: token }).exec();
    if (!hasToken) throw new BadRequestException('Token not found or expired');


    await this.otpModel.deleteOne({ otp_token: token }).exec();

    return hasToken;
  }


}
