import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Public } from 'src/base/jwt/jwt.decorator';
import { CheckTokenUserDto } from './dto/checkToken-user.dto';
import * as url from 'node:url';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post('create_usr')
  async createUser(@Body() req: CreateUserDto) {
    const result = await this.usersService.newUser({
      ...req
    });
    return result;
  }

  @Public()
  @Get('check_email_token')
  async checkEmailToken(@Query() query: CheckTokenUserDto) {
    return this.usersService.checkEmailToken(query);
  }
}
