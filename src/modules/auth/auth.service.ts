import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import {  } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { User } from '../users/schemas/user.schema';
import { getInfoData } from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if(!user) throw new BadRequestException("user not found");
    const matchPass = await bcrypt.compare(pass, user.usr_password);
    if(!matchPass) throw new BadRequestException("Pass sai")
      return user;
    
  }

  async createTokenPair(payload) {
     try {
      const accessToken = await this.jwtService.signAsync(payload, {expiresIn : '1000 days'})
      const refreshToken = await this.jwtService.signAsync(payload, {expiresIn : '7 days'}) 
      return {accessToken, refreshToken}
     } catch (error) {
      console.error(error);
     }
  }

  async login(username: string, password: string): Promise<any> {
    const foundUser = await this.usersService.findByEmail(username);
    if (!foundUser) throw new BadRequestException('User không tồn tại');

    const matchPass = await bcrypt.compare(password, foundUser.usr_password);
    if (!matchPass) throw new BadRequestException('Mật khẩu sai');

    const payload = { username: foundUser.usr_email, userId: foundUser._id , roles : foundUser.usr_roles};

    const tokens = await this.createTokenPair(payload);
    return {
      code: 200,
      metadata: {
        message: 'Login success',
        user: getInfoData({
          field: ["_id", "usr_name", "usr_email"],
           object : foundUser
          }),
          tokens
        
      },
    };
  }


}


