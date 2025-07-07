import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ImageStorageService } from './storage/image-storage.service';
import { ImageProcessorService } from './storage/image-processor.service';
import { LocalImageService } from './storage/local-image.service';
import { S3ImageService } from './storage/s3-image.service';

@Module({
  providers: [
    {
      provide: 'S3Client',
      useFactory: () =>
        new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        }),
    },
    ImageStorageService,
    ImageProcessorService,
    LocalImageService,
    S3ImageService,
  ],
  exports: [ImageStorageService],
})
export class ImagesModule {}
