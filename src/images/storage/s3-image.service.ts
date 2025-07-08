// src/images/storage/local-image.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ImageStorage } from './image-storage.interface';
import { ImageProcessorService } from './image-processor.service';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3ImageService implements ImageStorage {
  constructor(
    private readonly processor: ImageProcessorService,
    @Inject('S3Client') private readonly s3: S3Client,
  ) {}
  async saveImage(file: Express.Multer.File): Promise<string> {
    const { buffer, filename } = await this.processor.processImage(file);
    const commend = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${filename}`,
      Body: buffer,
      ContentType: 'image/webp',
    });
    await this.s3.send(commend);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/${filename}`;
  }

  async removeImage(filename: string): Promise<void> {
    const commend = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${filename}`,
    });
    await this.s3.send(commend);
  }
}
