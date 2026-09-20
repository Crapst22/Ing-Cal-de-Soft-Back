import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { TipoAumento } from 'src/modules/common/enums/tipo-aumento.emun';

export class ActualizarPreciosMasivoDto {
  @ApiProperty({
    enum: TipoAumento,
    description: 'Tipo de aumento: 1 = PORCENTAJE, 2 = MONTO_FIJO',
    example: TipoAumento.PORCENTAJE,
  })
  @IsNotEmpty({ message: 'El tipo de aumento es obligatorio' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = Number(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsEnum(TipoAumento, {
    message: 'El tipo de aumento debe ser 1 (PORCENTAJE) o 2 (MONTO_FIJO)',
  })
  tipoAumento: TipoAumento;

  @ApiProperty({
    description: 'Valor numérico del aumento (porcentaje o monto fijo)',
    example: 15.5,
  })
  @IsNotEmpty({ message: 'El valor es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El valor debe ser un número válido' })
  @Min(0.01, { message: 'El valor del aumento debe ser mayor a 0' })
  valor: number;

  @ApiPropertyOptional({
    description:
      'ID de la línea a la cual aplicar el aumento. Si no se especifica o es 0/null, se aplica de forma global.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID de la línea debe ser un número entero' })
  lineaId?: number;

  @ApiProperty({
    description: 'ID del usuario que realiza la actualización',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @Type(() => Number)
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  usuarioId: number;
}
