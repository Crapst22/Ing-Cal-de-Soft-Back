import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LineaDto {
  @ApiProperty({ example: 123, description: 'ID del la linea' })
  @Type(() => Number)
  @IsInt({ message: 'El id debe ser un número entero' })
  id: number;

  @ApiProperty({
    example: 'tornillos',
    description: 'Denominación o nombre dela linea',
  })
  @IsString({ message: 'La denominación debe ser un texto' })
  denominacion: string;

  @IsOptional()
  @IsInt()
  stockMinimo?: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la super línea a la que pertenece (null si no tiene)',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  superLineaId?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  utilizaStockMinimo: boolean;

  @ApiProperty({
    example: '',
    description: 'Observaciones varias sobre la linea',
  })
  @IsString({ message: 'La observación debe ser un texto' })
  observacion: string;

  @ApiProperty({
    example: 1,
    description: 'de sistema no se puede editar ni eliminar',
  })
  @Type(() => Number)
  @IsInt({ message: 'El sistema debe ser un número entero' })
  sistema: number;

  @ApiProperty({ example: null, description: 'Fecha de eliminación (null si está activa)', nullable: true })
  @IsOptional()
  deletedAt: string | null;

}
