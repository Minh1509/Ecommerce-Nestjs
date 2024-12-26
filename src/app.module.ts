import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './base/jwt/jwt-auth.guard';
import { MailModule } from './base/mail/mail.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ProductsModule } from './modules/products/products.module';
import { OtpModule } from './base/otp/otp.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './base/tasks/task.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadModule } from './modules/upload/upload.module';
import { CartModule } from './modules/cart/cart.module';
import { RedisModule } from './base/redis/redis.module';
import { RolesGuard } from './base/role/role.guard';
import { DiscountModule } from './modules/discount/discount.module';

@Module({
  imports: [
    DiscountModule,
    RedisModule,
    CartModule,
    UploadModule,
    ProductsModule,
    CategoriesModule,
    TaskModule,
    UsersModule,
    MailModule,
    OtpModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
