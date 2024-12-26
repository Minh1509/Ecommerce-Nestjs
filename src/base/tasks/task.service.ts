import UsersService from '../../modules/users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  constructor(
    private readonly userService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async checkHandleCron() {
    const today = new Date();
    const users = await this.userService.findUsersByBirthday(today);

    console.log(users);
    if (!users) return;
    await this.handleCron(users);
  }

  async handleCron(users: any[]) {
    for(const user of users) {
      this.mailService.sendEmailBirthday(user.usr_email, user.usr_name);
    }
  }
}
