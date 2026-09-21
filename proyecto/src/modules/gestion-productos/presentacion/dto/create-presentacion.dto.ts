import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TipoPresentacion } from '../utils/presentacion.util';

export class CreatePresentacionDto {
  @IsIn(['volume', 'pack'], { message: 'tipo debe ser "volume" o "pack".' })
  @IsNotEmpty({ message: 'El tipo es obligatorio.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  tipo: TipoPresentacion;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser mayor o igual a 1.' })
  quantity?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El volumen debe ser un número.' })
  @Min(0, { message: 'El volumen no puede ser negativo.' })
  volumen?: number | null;

  @IsOptional()
  @IsString({ message: 'La unidad debe ser un texto.' })
  @MaxLength(20, { message: 'La unidad no puede superar 20 caracteres.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  unidad?: string | null;

  createdAt?: Date;

  @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
  usuarioCreatedId: number;
}


export { CreatePresentacionDto as CreateMarcaDto };

