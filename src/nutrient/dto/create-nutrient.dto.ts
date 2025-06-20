import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateNutrientDto {
  @IsString()
  @IsNotEmpty({ message: '食品名稱不可為空' })
  name: string;

  @IsString()
  brand?: string;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @Min(0)
  calories: number;

  @IsNumber()
  @Min(0)
  carbs: number;

  @IsNumber()
  @Min(0)
  protein: number;

  @IsNumber()
  @Min(0)
  fat: number;

  @IsString()
  description?: string;

  @IsString()
  source?: string;

  @IsString()
  category?: string;
}
