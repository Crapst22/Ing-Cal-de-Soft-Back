import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreatePresentacionDto } from './create-presentacion.dto';

export class UpdatePresentacionDto extends PartialType(CreatePresentacionDto) {
  @IsOptional()
  quantity?: number | null;

  @IsOptional()
  volumen?: number | null;

  @IsOptional()
  @IsString()
  unidad?: string | null;

  updatedAt: Date;

  @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
  usuarioUpdatedId: number;
}