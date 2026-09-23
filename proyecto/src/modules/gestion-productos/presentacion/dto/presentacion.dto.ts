import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoPresentacion } from '../domain/value-objects/denominacion-presentacion';

export class PresentacionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ enum: ['volume', 'pack'] })
  @IsString()
  tipo: TipoPresentacion;

  @ApiProperty({ example: 6, nullable: true })
  @IsOptional()
  @IsNumber()
  quantity: number | null;

  @ApiProperty({ example: 0.5, nullable: true })
  @IsOptional()
  @IsNumber()
  volumen: number | null;

  @ApiProperty({ example: 'L', nullable: true })
  @IsOptional()
  @IsString()
  unidad: string | null;

  @ApiProperty({ example: 'Pack x6 de 500ml' })
  @IsString()
  denominacion: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  sistema: number;

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  deletedAt: string | null;
}