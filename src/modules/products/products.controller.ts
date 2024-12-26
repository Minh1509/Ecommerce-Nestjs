import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddProductDto } from './dto/add-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ValidateProductPipe } from './validations/validate';
import { Roles } from '../../base/role/role.decorator';
import { Role } from '../../base/role/roles.enum';

@Roles(Role.Admin)
@Controller('products')
@ApiBearerAuth('Authorization')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post('createProduct')
  async createProduct(@Body() payload: CreateProductDto) {
    return await this.productsService.createProduct(payload);
  }

  @UsePipes(ValidateProductPipe)
  @Patch('update/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() bodyUpdate: UpdateProductDto,
  ) {
    return await this.productsService.updateProduct(bodyUpdate, id);
  }

  @UsePipes(ValidateProductPipe)
  @Put('addProductToCategory/:productId/:categoryId')
  async addProductToCategory(@Param() addProductDto: AddProductDto) {
    return await this.productsService.addProductToCategory(addProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param() id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
