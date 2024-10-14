import { Body, Controller, Post } from '@nestjs/common';
import { S3Service } from 'src/service/s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('presigned/profile')
  async imgPresignedUrl(@Body('fileName') fileName: string) {
    const refinedFileName = fileName.trim().toLowerCase();
    return await this.s3Service.presignedImg(refinedFileName);
  }
}
