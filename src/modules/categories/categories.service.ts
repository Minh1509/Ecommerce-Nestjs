import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
  ) {}

  async findCategoryByTwoId({productId, categoryId}) {
    return await this.categoryModel.findOne({
      _id: categoryId,
      productIds: new Types.ObjectId(productId)
    }).exec()
  }

  async removeProductFromCategory({productId, categoryId}) {
    return await this.categoryModel.findByIdAndUpdate(
      categoryId,
      {
        $pull: {
          productIds: new Types.ObjectId(productId)
        }
      },
      {upsert: true,new: true}
    ).exec()
  }

  async addProductToCategory({productId, categoryId}) {
    return await this.categoryModel
      .findByIdAndUpdate(
        { _id: categoryId },
        {
          $addToSet: { productIds: new Types.ObjectId(productId) },
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  // Post
  async createCategory(payload: any) {
    const newCategory = await this.categoryModel.create({
      ...payload,
    });
    if (!newCategory) throw new BadRequestException('Create category failed');

    return {
      code: 201,
      message: 'Create category success',
      metadata: newCategory,
    };
  }
  // End post

  //   Patch
  async updateCategory(bodyUpdate: UpdateCategoryDto, categoryId : string) {
    return await this.categoryModel.findByIdAndUpdate(categoryId, bodyUpdate, {new: true})
  }
//   End patch

  // Put
  async unAddProductFromCategory({productId, categoryId}){
    const category = await this.findCategoryByTwoId({productId, categoryId})
    if(!category) throw new BadRequestException("category not found")

    const product = await this.productService.findProductByTwoId({productId, categoryId});
    if(!product) throw new BadRequestException("Product not found")

    const updateCategory = await this.removeProductFromCategory({productId, categoryId})
    const updateProduct = await  this.productService.removeCategoryFromProduct({productId, categoryId});

    return {
      updateCategory,
      updateProduct
    }
  }
  //   end Put

//   Query
  async findAllCategory (): Promise<CategoryDocument[]> {
    return await this.categoryModel.find().populate("productIds","name -_id").exec()
  }

  async findProductFromCategory({categoryId}, {limit, page} ) {
    return await this.productService.findProductFromCategory({categoryId,limit,page});
  }
//   End query

  // delete
  async deleteCategory(categoryId : string) {
    const category = await this.categoryModel.findById(categoryId).exec();
    if(!category) throw new BadRequestException("Category not found");

    const productIds = category.productIds.map((id: Types.ObjectId) => id.toString());

    if(productIds && productIds.length>0) {
      for(const productId of productIds) {
        await this.productService.removeCategoryFromProduct({productId, categoryId});
      }
    }
    return await this.categoryModel.deleteOne({_id: categoryId});
  }
//   end delete


}
