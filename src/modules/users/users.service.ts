import { AuthService } from './../auth/auth.service';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../base/mail/mail.service';
import { getInfoData } from 'src/common/utils';
import { OtpService } from '../../base/otp/otp.service';
import { CheckTokenUserDto } from './dto/checkToken-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
    private otpService: OtpService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async findUsersByBirthday(today: Date): Promise<UserDocument[]> {
    const users = await this.userModel.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: '$usr_date_of_birth' }, today.getDate()] },
          { $eq: [{ $month: '$usr_date_of_birth' }, today.getMonth() + 1] },
        ],
      },
    });

    return users;
  }

  async findByEmail(username: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ usr_email: username }).exec();
    return user;
  }

  async findUserById(userId: string): Promise<User | undefined> {
    return await this.userModel.findById(userId).lean().exec();
  }

  async newUser({ email, name, date_of_birth } : CreateUserDto) {
    // check email
    const user = await this.findByEmail(email);
    if (user) throw new UnauthorizedException('Email da ton tai');

    //  send email
    const result = await this.mailService.sendEmailToken({
      email,
      name,
      date_of_birth,
    });
    return {
      code: 201,
      message: 'verify email user',
      token: result,
    };
  }

  async checkEmailToken({ token, name, date_of_birth } : CheckTokenUserDto) {
    const { otp_email: email } = await this.otpService.checkEmailToken({
      token,
    });
    if (!email) throw new BadRequestException('Token lỗi');

    // check email exist in user model
    const foundUser = await this.findByEmail(email);
    if (foundUser)
      throw new BadRequestException('User đã tồn tại với email này');

    const passwordHash = await bcrypt.hash(email, 10);
    const newUser = await this.userModel.create({
      usr_name: name,
      usr_email: email,
      usr_password: passwordHash,
      usr_status: 'active',
      usr_date_of_birth: date_of_birth,
    });

    if (!newUser) throw new BadRequestException('Create failed');

    const payload = { username: newUser.usr_email, userId: newUser._id };
    const tokens = await this.authService.createTokenPair(payload);

    return {
      code: 200,
      metadata: {
        message: 'Success verify',
        user: getInfoData({
          field: ['_id', 'usr_name', 'usr_email'],
          object: newUser,
        }),
        tokens,
      },
    };
  }
}

export default UsersService;
