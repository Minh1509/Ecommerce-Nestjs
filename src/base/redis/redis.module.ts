import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import * as process from 'node:process';


@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS',
      useFactory : () => {
        return new Redis ({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT)
        })
      }
    }
  ],
  exports: [RedisService, 'REDIS']
})

export class RedisModule{}
