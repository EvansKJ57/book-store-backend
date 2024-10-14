import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('S3_REGION'),
      credentials: {
        accessKeyId: configService.get('S3_ACCESS_ID'),
        secretAccessKey: configService.get('S3_ACCESS_KEY'),
      },
    });
  }

  async presignedImg(name: string) {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const filePath = `profile/${name}-${Date.now()}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filePath,
    });
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 120, //seconds
    });

    return { presignedUrl };
  }
}
