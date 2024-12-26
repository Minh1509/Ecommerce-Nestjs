import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductDto } from './dto/query-product.dto';
import { Public } from '../../base/jwt/jwt.decorator';


@Public()
@Controller('products')
export class UserProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  async searchProductByUser(@Query() query: QueryProductDto) {
    return await this.productsService.searchProductByUser(query);
  }

  @Get(':id')
  async findProductById(@Param('id') id: string) {
    return await this.productsService.findProductById({ productId: id });
  }
}
