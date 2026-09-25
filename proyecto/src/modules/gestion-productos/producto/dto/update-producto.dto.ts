import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString({ message: 'La denominación debe ser una cadena de texto.' }) // Valida que sea string
  @IsNotEmpty({ message: 'La denominación no puede estar vacía.' }) // Valida que no esté vacía
  @MaxLength(255, { message: 'La denominación no puede estar vacía.' })
  @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ.\-/]+$/, {
    message:
      'La denominación solo puede contener letras, números, espacios, puntos, guiones y barras.',
  })
  denominacion: string;

  @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
  usuarioUpdatedId: number;

  @IsOptional()
  @IsString({ message: 'El motivo del cambio de precio debe ser texto.' })
  @MaxLength(500, { message: 'El motivo no puede superar 500 caracteres.' })
  motivo?: string;

  updatedAt: Date;
}
