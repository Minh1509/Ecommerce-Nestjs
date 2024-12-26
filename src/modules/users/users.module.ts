import { AuthService } from './../auth/auth.service';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailModule } from '../../base/mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { OtpModule } from '../../base/otp/otp.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    OtpModule,
    MailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
