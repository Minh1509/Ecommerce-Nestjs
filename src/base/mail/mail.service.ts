import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class MailService {
  constructor(
    private otpService: OtpService,
    private readonly mailerService: MailerService,
  ) { }

  async sendEmailToken({ email,  name, date_of_birth}) {
    try {
      // get token
      const token = await this.otpService.newOtp({ email });

      // sendEmail
      return this.mailerService
        .sendMail({
          to: email,
          subject: 'Vui lòng xác nhận kích hoạt tài khoản Shop...',
          text: 'Welcome',
          template: 'confirmation.hbs',
          context: {
            name: name,
            activationToken: token.otp_token,
            date_of_birth: date_of_birth
          },
        })
        .then(() => { })
        .catch(() => { });
    } catch (e) {
      console.error('Error in sendEmailToken: ', e);

    }
  }

  async sendEmailBirthday(email: string, name: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Happy birthday',
      text: "Happy birthday",
      html: `<p>Happy birthday ${name}</p>`
    })
  }

  
}