import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import Redis from 'ioredis';
import { Product } from './interface/product';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @Inject('REDIS') private redisClient: Redis,
  ) {}

  async getCart(userId: string) {
    const key = `cart:${userId}`;

    const foundCartRedis = await this.redisClient.hlen(key);
    if (foundCartRedis === 0) {
      const foundCart = await this.cartModel.findOne({
        cart_userId: new Types.ObjectId(userId),
      });
      if (foundCart) {
        if (foundCart.cart_products.length > 0) {
          const foundProducts = foundCart.cart_products;
          foundProducts.map(
            async (foundProduct) =>
              await this.redisClient.hset(
                key,
                `product:${foundProduct.productId.toString()}`,
                JSON.stringify(foundProduct),
              ),
          );
        }
      }
    }

    const result = await this.redisClient.hgetall(key);
    const countProduct = await this.redisClient.hlen(key);
    return {
      code : 'xxx',
      message: 'Get cart sucess',
      meta: {
        countTotalProduct: countProduct,
        result: result,
      },
    };
  }

  async addToCart(userId: string, product: CreateCartDto) {
    const key = `cart:${userId}`;

    await this.getCart(userId);

    const redisProduct = await this.redisClient.hget(
      key,
      `product:${product.productId}`,
    );

    if (redisProduct) {
      const parseProduct: Product = JSON.parse(redisProduct);
      parseProduct.quantity += product.quantity;
      parseProduct.price = product.price;
      await this.redisClient.hset(
        key,
        `product:${product.productId}`,
        JSON.stringify(parseProduct),
      );
    } else {
      await this.redisClient.hset(
        key,
        `product:${product.productId}`,
        JSON.stringify(product),
      );
    }
    return {
      code: 'xxx',
      message: 'Add product to cart success',
      meta: product,
    };
  }

  async updateCart(userId, { productId, quantity, price }: UpdateCartDto) {
    const key = `cart:${userId}`;
    const field = `product:${productId}`;
    const foundProductRedis = await this.redisClient.hget(key, field);
    if (!foundProductRedis)
      throw new BadRequestException('Product redis not found');

    const parseProduct = JSON.parse(foundProductRedis);
    parseProduct.quantity = quantity;
    parseProduct.price = price;

    const result = await this.redisClient.hset(
      key,
      field,
      JSON.stringify(parseProduct),
    );
    return {
      code: 201,
      message: 'update success',
      meta: result,
    };
  }

  async deleteProduct(userId: string, productId: string) {
    const key = `cart:${userId}`;
    const field = `product:${productId}`;
    const product = await this.redisClient.hget(key, field);
    if (!product) throw new BadRequestException('Product not found');
    const result = await this.redisClient.hdel(key, field);
    return {
      code: 'xxx',
      message: 'Delete product success',
      meta: result
    };
  }

  async countProduct(userId: string) {
    const key = `cart:${userId}`;
    return await this.redisClient.hlen(key);
  }

  async syncCartMongodb(userId: string) {
    const key = `cart:${userId}`;
    const productsRedis = await this.redisClient.hvals(key);

    const parseProducts = productsRedis.map((item) => {
      const product = JSON.parse(item);
      return {
        productId: new Types.ObjectId(product.productId),
        quantity: product.quantity,
        price: product.price,
      };
    });

    const countProduct = await this.redisClient.hlen(key);

    if (countProduct > 0) {
      await this.cartModel.findOneAndUpdate(
        { cart_userId: new Types.ObjectId(userId), cart_state: 'active' },
        {
          $set: {
            cart_count_product: countProduct,
            cart_products: parseProducts,
            cart_userId: new Types.ObjectId(userId),
          },
        },
        { upsert: true, new: true },
      );
    }
    await this.redisClient.del(key)

    return {
      code: 'xxx',
      message: 'sync db success',
      meta: parseProducts,
      countTotalProduct: countProduct
    }
  }
}
