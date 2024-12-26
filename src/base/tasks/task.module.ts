import { Module } from '@nestjs/common';
import { UsersModule } from '../../modules/users/users.module';
import { MailModule } from '../mail/mail.module';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ UsersModule, MailModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}