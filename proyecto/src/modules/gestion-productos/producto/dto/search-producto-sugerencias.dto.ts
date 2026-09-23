import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductoSugerenciasDto {
  @IsOptional()
  @IsString()
  texto?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'take debe ser un número entero mayor que 0' })
  @Type(() => Number)
  take: number = 5;
}