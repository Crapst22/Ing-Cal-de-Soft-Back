import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreatePresentacionDto } from './create-presentacion.dto';

export class UpdatePresentacionDto extends PartialType(CreatePresentacionDto) {
  @IsOptional()
  quantity?: number | null;

  @IsOptional()
  volumen?: number | null;

  @IsOptional()
  @IsString()
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser mayor o igual a 1.' })
  @MaxLength(20, { message: 'La unidad no puede superar 20 caracteres.' })
  unidad?: string | null;

  updatedAt: Date;

  @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
  usuarioUpdatedId: number;
}
