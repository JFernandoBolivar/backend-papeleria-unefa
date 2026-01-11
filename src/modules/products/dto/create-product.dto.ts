import {
  IsNumber,
  IsString,
  MinLength,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;
  @IsNumber()
  price: number;
  @IsInt()
  stock: number;
  @IsInt()
  minStock: number;
  @IsInt()
  categoryId: number;
}
