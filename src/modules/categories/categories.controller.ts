import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AddCategoryDto } from './dto/add-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ValidateCategoryPipe } from './validators/validate';
import { Roles } from '../../base/role/role.decorator';
import { Role } from '../../base/role/roles.enum';

@Roles(Role.Admin)
@Controller('categories')
@ApiBearerAuth('Authorization')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('createCategory')
  @UsePipes(ValidateCategoryPipe)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Patch('update/:id')
  @UsePipes(ValidateCategoryPipe)
  async updateCategory(
    @Body() bodyUpdate: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    return await this.categoriesService.updateCategory(bodyUpdate, id);
  }

  @Put('unAddProductFromCategory/:productId/:categoryId')
  async unAddProductFromCategory(@Param() addCategoryDto: AddCategoryDto) {
    return await this.categoriesService.unAddProductFromCategory(
      addCategoryDto,
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.categoriesService.deleteCategory(id);
  }
}
