import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/config/multer.config';
import { ImageStorageService } from 'src/images/storage/image-storage.service';

@Controller('test')
export class TestController {
  constructor(private readonly imageStorageService: ImageStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.imageStorageService.saveImage(file);
    return result;
  }

  @Delete('remove')
  async remove(@Body('filename') filename: string) {
    await this.imageStorageService.removeImage(filename);
    return 'success';
  }
}
