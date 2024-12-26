import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AwsModule } from '../../base/aws/aws.module';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsModule } from '../products/products.module';
import { MulterConfigService } from './multer.config';


@Module({
  imports: [
    ProductsModule,
    AwsModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],

  exports: [UploadService],
})
export class UploadModule {}
