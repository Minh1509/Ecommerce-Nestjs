import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '../../base/jwt/jwt.decorator';
import { FindProductCategoryDTO } from './dto/findProduct-category.dto';
import { Roles } from '../../base/role/role.decorator';
import { Role } from '../../base/role/roles.enum';


@Controller('categories')
@Public()
export class UserCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAllCategory() {
    return await this.categoriesService.findAllCategory();
  }

  @Get(':id')
  async findProductFromCategory(
    @Param('id') categoryId: string,
    @Query() query: FindProductCategoryDTO,
  ) {
    return await this.categoriesService.findProductFromCategory(
      { categoryId },
      query,
    );
  }
}
