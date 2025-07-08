// src/images/storage/image-storage.service.ts
import { Injectable } from '@nestjs/common';
import { ImageStorage } from './image-storage.interface';
import { LocalImageService } from './local-image.service';
import { S3ImageService } from './s3-image.service';

@Injectable()
export class ImageStorageService implements ImageStorage {
  private impl: ImageStorage;

  constructor(
    private local: LocalImageService,
    private s3: S3ImageService,
  ) {
    const env = process.env.NODE_ENV ?? 'development';
    this.impl = env === 'production' ? this.s3 : this.local;
  }

  saveImage(file: Express.Multer.File): Promise<string> {
    return this.impl.saveImage(file);
  }

  removeImage(filename: string): Promise<void> {
    return this.impl.removeImage(filename);
  }
}
