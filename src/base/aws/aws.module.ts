import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [ConfigModule],
  providers: [

    AwsService,
    {
      provide: 'S3Client',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get<string>('S3_REGION'),
          credentials: {
            accessKeyId: configService.get<string>('S3_ACCESS_KEY'),
            secretAccessKey: configService.get<string>('S3_SECRET_ACCESS_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [AwsService, 'S3Client'],
})
export class AwsModule {}
