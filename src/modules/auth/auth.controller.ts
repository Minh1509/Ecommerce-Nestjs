import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from '../../base/jwt/jwt-auth.guard';
import { Public } from '../../base/jwt/jwt.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()

  async login(@Body() req : LoginAuthDto ) {
    return this.authService.login(req.username, req.password);
  }


  @Post('profile')
  @ApiBearerAuth('Authorization')
  async profile(@Request() req) {
    return req.user;
  }

  
}
