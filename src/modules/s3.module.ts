import { Module } from '@nestjs/common';
import { S3Service } from '../service/s3.service';
import { S3Controller } from 'src/controller/s3.controller';

@Module({
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
