import { Injectable } from '@nestjs/common';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import * as sharp from 'sharp';
import * as heicConvert from 'heic-convert';
import { existsSync, unlinkSync } from 'fs';
import * as fs from 'fs/promises';

@Injectable()
export class ImagesService {
  private prisma = new PrismaClient();
  async create(file: Express.Multer.File) {
    const filename = await this.processImage(file);
    const url = `/uploads/${filename}`;
    const image = await this.prisma.image.create({
      data: {
        filename,
        url,
      },
    });
    return image;
  }

  async findAll() {
    return await this.prisma.image.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    return await this.prisma.image.findUnique({ where: { id } });
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    const rootPath = process.cwd();
    const filePath = join(rootPath, 'uploads', image.filename);
    unlinkSync(filePath);

    return await this.prisma.image.delete({ where: { id } });
  }

  async processImage(file: Express.Multer.File): Promise<string> {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    const newFileName = `${Date.now()}-${Math.random().toString().slice(2)}.webp`;
    const rootPath = process.cwd();
    const outputPath = join(rootPath, 'uploads', newFileName);
    const prevFilePath = join(rootPath, 'uploads', file.filename);

    let imageBuffer: Buffer;

    if (ext === 'heic' || ext === 'heif') {
      const inputBuffer = await fs.readFile(prevFilePath);
      imageBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 1,
      });
    } else {
      imageBuffer = await fs.readFile(prevFilePath);
    }

    // sharp 會自動辨識 HEIC，不需額外轉換，只要來源格式有支援即可
    await sharp(imageBuffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(outputPath);

    if (existsSync(prevFilePath)) {
      unlinkSync(prevFilePath);
    }
    return newFileName;
  }
}
