import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Roles } from '../../base/role/role.decorator';
import { Role } from '../../base/role/roles.enum';

@Roles(Role.User, Role.Admin)
@ApiTags('carts')
@ApiBearerAuth('Authorization')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('getCart')
  async getCart(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return await this.cartService.getCart(user.userId);
  }
  @Post('addToCart')
  async addToCart(@Req() req: Request, @Body() body: CreateCartDto) {
    const user = req.user as JwtPayload;
    return await this.cartService.addToCart(user.userId, body);
  }

  @Post('updateCart')
  async updateCart(@Req() req: Request, @Body() body: UpdateCartDto) {
    const user = req.user as JwtPayload;
    return await this.cartService.updateCart(user.userId, body);
  }

  @Get('countProduct')
  async countProduct(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return await this.cartService.countProduct(user.userId);
  }

  @Delete('deleteProduct/:productId')
  async deleteProduct(
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const user = req.user as JwtPayload;
    return await this.cartService.deleteProduct(user.userId, productId);
  }

  @Post('syncCartMongodb')
  async syncCartMongodb(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return await this.cartService.syncCartMongodb(user.userId);
  }
}
