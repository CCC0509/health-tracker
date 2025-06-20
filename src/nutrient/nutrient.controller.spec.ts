import { Test, TestingModule } from '@nestjs/testing';
import { NutrientController } from './nutrient.controller';
import { NutrientService } from './nutrient.service';

describe('NutrientController', () => {
  let controller: NutrientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutrientController],
      providers: [NutrientService],
    }).compile();

    controller = module.get<NutrientController>(NutrientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
