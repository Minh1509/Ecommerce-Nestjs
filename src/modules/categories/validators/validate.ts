import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ValidateCategoryPipe implements PipeTransform {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async transform(value: any, metadata: any) {
    console.log(metadata)
    if (metadata.type === 'param' && metadata.data === 'id') {
      const id = value;
      if(!Types.ObjectId.isValid(id)) throw new BadRequestException("Invalid id format")

      const foundCategoryUpdate = await this.categoryModel.findOne({_id: new Types.ObjectId(id)});
      if (!foundCategoryUpdate) throw new BadRequestException("Category ko ton tai de update")
      return value;
    }

    return value;
  }

}