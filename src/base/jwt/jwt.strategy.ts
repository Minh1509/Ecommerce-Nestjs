import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../modules/users/users.service';
import { User } from '../../modules/users/users.class';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      private configService: ConfigService,
      private jwtService: JwtService,
      private userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any): Promise<User> {
        const { userId, username, roles } = payload;
        if (!userId || !roles) {
            throw new UnauthorizedException('UserId or role is missing in the token');
        }

        const foundUser = await this.userService.findUserById(userId);
        if (!foundUser) {
            throw new UnauthorizedException('User not found');
        }


       req.user = {userId, username, roles}
        const user: User = req.user as User;

        return user;
    }

}
