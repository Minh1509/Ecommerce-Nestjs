import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schem';
import { CategoriesService } from '../categories/categories.service';
import Redis from 'ioredis';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    @Inject('REDIS') private redisClient: Redis
  ) {}

  async findAll() {
    return await this.productModel.find();
  }

  async findProductByTwoId({ productId, categoryId }) {
    return await this.productModel.findOne({
      _id: productId,
      categoryIds: new Types.ObjectId(categoryId),
    });
  }

  async removeCategoryFromProduct({ productId, categoryId }) {
    return await this.productModel
      .findByIdAndUpdate(
        productId,
        {
          $pull: {
            categoryIds: new Types.ObjectId(categoryId),
          },
        },
        { new: true },
      )
      .exec();
  }

  async addCategoryToProduct({ productId, categoryId }) {
    return await this.productModel
      .findByIdAndUpdate(
        productId,
        {
          $addToSet: {
            categoryIds: new Types.ObjectId(categoryId),
          },
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  // Post
  async createProduct(payload: CreateProductDto) {
    const newProduct = await this.productModel.create({
      ...payload,
    });
    if (!newProduct) throw new BadRequestException('Create product failed');
    return {
      code: 201,
      message: 'Create product success',
      metadata: newProduct,
    };
  }

  // end post

  // Patch
  async updateProduct(bodyUpdate: UpdateProductDto, productId) {
    return await this.productModel.findByIdAndUpdate(productId, bodyUpdate, {
      new: true,
    });
  }

  // End patch

  // Put
  async addProductToCategory({ productId, categoryId }) {
    const productUpdate = await this.addCategoryToProduct({ productId, categoryId, });
    const categoryUpdate = await this.categoriesService.addProductToCategory({ productId, categoryId, });

    return {
      productUpdate,
      categoryUpdate,
    };
  }

  // end put

  //query
  async findProductById({ productId }) {
    return await this.productModel.findById(productId).exec();
  }

  async findAllProduct({ limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    return await this.productModel
      .find()
      .populate('categoryIds', 'name -_id')
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit)
      .select('name price')
      .exec();
  }

  async findProductFromCategory({ categoryId, limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    const result = await this.productModel
      .find({
        categoryIds: new Types.ObjectId(categoryId),
      })
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit)
      .select('name price')
      .exec();
    const totalProduct = await this.productModel.countDocuments({
      categoryIds: new Types.ObjectId(categoryId),
    });
    return {
      data: result,
      meta: {
        currentPage: page,
        countProduct: limit,
        totalProduct: totalProduct,
        totalPage: +totalProduct / limit,
      },
    };
  }

  async searchProductByUser({ keySearch, limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    let result, totalProduct;

    const key = keySearch
      ? `product:keySearch=${keySearch}&limit=${limit}&page=${page}`
      : `product:all&limit=${limit}&page=${page}`;

    const foundProductRedis = await this.redisClient.get(key);
    if (foundProductRedis) {
      const cachedData = JSON.parse(foundProductRedis);
      return {
        message: 'Find product success cached',
        data: cachedData.data,
        meta: cachedData.meta,
      };
    }

    if (keySearch) {
      result = await this.productModel
        .find(
          {
            $text: { $search: keySearch },
          },
          {
            score: { $meta: 'textScore' },
          },
        )
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit);

      totalProduct = await this.productModel.countDocuments({
        $text: { $search: keySearch },
      });
    } else {
      result = await this.findAllProduct({ limit, page });
      totalProduct = await this.productModel.countDocuments();
    }

    const totalPage = Math.ceil(totalProduct / limit);

    const response = {
      data: result,
      meta: {
        currentPage: page,
        countProduct: result.length,
        totalProduct: totalProduct,
        totalPage: totalPage,
      },
    };

    await this.redisClient.set(
      key,
      JSON.stringify({
        data: response.data,
        meta: response.meta,
      }),
      'EX', 60
    );

    return response;
  }



  //end query

  //   delete
  async deleteProduct(productId) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new BadRequestException('product not found');

    const categoryIds = product.categoryIds.map((id: Types.ObjectId) =>
      id.toString(),
    );

    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await this.categoriesService.removeProductFromCategory({
          categoryId,
          productId,
        });
      }
    }
    return await this.productModel.deleteOne({ _id: productId });
  }

  // end delete
}
