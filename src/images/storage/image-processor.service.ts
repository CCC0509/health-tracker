// images/storage/image-processor.service.ts
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import { existsSync, unlinkSync } from 'fs';
import { extname } from 'path';

@Injectable()
export class ImageProcessorService {
  async processImage(file: Express.Multer.File): Promise<{
    buffer: Buffer;
    filename: string;
  }> {
    const heicConvert = await import('heic-convert');
    const ext = extname(file.originalname).slice(1).toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString().slice(2)}.webp`;

    const originalFilePath = file.path;
    const inputBuffer = await fs.readFile(originalFilePath);

    let sourceBuffer: Buffer;

    if (ext === 'heic' || ext === 'heif') {
      sourceBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG', // sharp 無法直接壓 heic，要轉為 jpeg buffer
        quality: 1,
      });
    } else {
      sourceBuffer = inputBuffer;
    }

    const resultBuffer = await sharp(sourceBuffer)
      .resize({ width: 2048, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 80, effort: 5 })
      .toBuffer();

    // 清除 multer 存的暫存檔
    if (existsSync(originalFilePath)) {
      try {
        unlinkSync(originalFilePath);
      } catch (error) {
        console.warn(`❗ Failed to delete file: ${originalFilePath}`, error);
      }
    }

    return { buffer: resultBuffer, filename: fileName };
  }
}
