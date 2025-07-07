// src/images/storage/local-image.service.ts
import { Injectable } from '@nestjs/common';
import { ImageStorage } from './image-storage.interface';
import * as fs from 'fs/promises';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { ImageProcessorService } from './image-processor.service';

@Injectable()
export class LocalImageService implements ImageStorage {
  constructor(private readonly processor: ImageProcessorService) {}
  async saveImage(file: Express.Multer.File): Promise<string> {
    const { buffer, filename } = await this.processor.processImage(file);
    const outputPath = join(process.cwd(), 'uploads', filename);

    await fs.writeFile(outputPath, buffer);

    if (existsSync(file.path)) unlinkSync(file.path);

    return `/uploads/${filename}`; // 可被 static serve
  }
}
