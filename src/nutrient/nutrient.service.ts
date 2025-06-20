import { Injectable } from '@nestjs/common';
import { CreateNutrientDto } from './dto/create-nutrient.dto';
import { UpdateNutrientDto } from './dto/update-nutrient.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NutrientService {
  constructor(private prisma: PrismaService) {}
  create(data: CreateNutrientDto) {
    return this.prisma.nutrient.create({ data });
  }

  findAll() {
    return this.prisma.nutrient.findMany();
  }

  findOne(id: number) {
    return this.prisma.nutrient.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateNutrientDto) {
    return this.prisma.nutrient.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.nutrient.delete({ where: { id } });
  }
}
