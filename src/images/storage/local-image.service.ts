// src/images/storage/local-image.service.ts
import { Injectable } from '@nestjs/common';
import { ImageStorage } from './image-storage.interface';
import * as fs from 'fs/promises';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { ImageProcessorService } from './image-processor.service';

@Injectable()
export class LocalImageService implements ImageStorage {
  constructor(private readonly processor: ImageProcessorService) {}
  async saveImage(file: Express.Multer.File): Promise<string> {
    const { buffer, filename } = await this.processor.processImage(file);
    const outputPath = join(process.cwd(), 'uploads', filename);

    await fs.writeFile(outputPath, buffer);

    return `${filename}`;
  }

  async removeImage(filename: string): Promise<void> {
    const path = join(process.cwd(), 'uploads', filename);
    if (existsSync(path)) {
      try {
        unlinkSync(path);
      } catch (error) {
        console.warn(`❗ Failed to delete file: ${path}`, error);
      }
    }
  }
}
