import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as sharp from 'sharp';

@Injectable()
export class AwsService {
  constructor(
     @Inject('S3Client')private s3Client: S3Client,
    private configService: ConfigService,
  ) {}

  async putObjectCommand(buffer: Buffer,  imageName: string , contentType) {
    return await new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: imageName,
      Body: buffer,
      ContentType: contentType,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const imageName = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`;
    const thumbName = `thumb-${crypto.randomBytes(16).toString('hex')}-${file.originalname}`;

    const command = await this.putObjectCommand(file.buffer, imageName, file.mimetype);
    await this.s3Client.send(command);
    const originalUrl = `https://${this.configService.get<string>('CLOUD_FRONT')}/${imageName}`;

    const thumbBuffer = await sharp(file.buffer).resize(100, 100).toBuffer();
    const thumbCommand = await this.putObjectCommand(thumbBuffer, thumbName, file.mimetype);
    await this.s3Client.send(thumbCommand);
    const thumbUrl = `https://${this.configService.get<string>('CLOUD_FRONT')}/${thumbName}?width=100&height=100`;
    return {
      name: file.originalname,
      url: originalUrl,
      thumb: thumbUrl,
    };
  }
}
