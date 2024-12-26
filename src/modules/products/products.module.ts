import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schem';
import { CategoriesModule } from '../categories/categories.module';
import { UserProductsController } from './user-products.controller';
import { ValidateProductPipe } from './validations/validate';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from '../../base/redis/redis.module';


@Module({
  imports: [
    RedisModule,
    forwardRef(() => CategoriesModule),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature(([{name: Category.name, schema: CategorySchema}]))
  ],
  controllers: [ProductsController,UserProductsController],
  providers: [ProductsService, ValidateProductPipe],
  exports: [ProductsService],
})
export class ProductsModule {}
