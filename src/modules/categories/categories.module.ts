import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { ProductsModule } from '../products/products.module';
import { UserCategoriesController } from './user-categories.controller';
import { ValidateCategoryPipe } from './validators/validate';
import { ValidateProductPipe } from '../products/validations/validate';

@Module({
  imports: [
    forwardRef(() => ProductsModule),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController, UserCategoriesController],
  providers: [CategoriesService, ValidateCategoryPipe],
  exports: [CategoriesService],
})
export class CategoriesModule {}
