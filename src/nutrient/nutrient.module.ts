import { Module } from '@nestjs/common';
import { NutrientService } from './nutrient.service';
import { NutrientController } from './nutrient.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NutrientController],
  providers: [NutrientService],
})
export class NutrientModule {}
