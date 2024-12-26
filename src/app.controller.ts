import { Controller, Get, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { JwtAuthGuard } from './base/jwt/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private authService: AuthService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
