import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [TestController],
  imports: [ImagesModule],
})
export class TestModule {}
