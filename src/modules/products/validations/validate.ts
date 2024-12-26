import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schem';
import { Model, Types } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from '../../categories/schemas/category.schema';

@Injectable()
export class ValidateProductPipe implements PipeTransform {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async transform(value: any, metadata: any) {
    if (metadata.type === 'param' && metadata.data === 'id') {
      const id = value;
      if (!Types.ObjectId.isValid(id))
        throw new BadRequestException('Invalid id format');

      const foundCategoryUpdate = await this.productModel.findOne({
        _id: new Types.ObjectId(id),
      });
      if (!foundCategoryUpdate)
        throw new BadRequestException('Product ko ton tai de update');
      return value;
    } else if(metadata.type === 'param' && !metadata.data){
      const productId = value.productId;
      const categoryId = value.categoryId;
      if (!Types.ObjectId.isValid(productId))
        throw new BadRequestException('Invalid id format');
      if (!Types.ObjectId.isValid(categoryId))
        throw new BadRequestException('Invalid id format');

      const product = await this.productModel.find({
        _id: new Types.ObjectId(productId),
        categoryIds: categoryId
      });
      if (product) throw new BadRequestException('cate da ton tai trong product');

      const category = await this.categoryModel.find({
        _id: new Types.ObjectId(categoryId),
        productIds: productId
      })
      if(category) throw new BadRequestException("Product da ton tai trong cate")
    }

    return value;
  }
}
