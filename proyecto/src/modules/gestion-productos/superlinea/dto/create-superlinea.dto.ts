import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsOptional,
  IsInt,
  IsArray,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperLineaDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString({ message: 'La denominación debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La denominación no puede estar vacía.' })
  @MaxLength(255, { message: 'La denominación no puede exceder los 255 caracteres.' })
  @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'La denominación solo puede contener letras, números y espacios.',
  })
  denominacion: string;

  @IsOptional()
  @IsString()
  observacion?: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'IDs de las líneas que se asocian a esta superlínea',
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Las líneas deben enviarse como un listado de ids.' })
  @IsInt({ each: true, message: 'Cada línea debe ser un id numérico.' })
  lineaIds?: number[];

  createdAt?: Date;

  @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
  usuarioCreatedId: number;

  @ApiProperty({
    example: null,
    description: 'Fecha de eliminación (null si está activa)',
    nullable: true,
  })
  @IsOptional()
  deletedAt: string | null;
}