import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class UpdatePrecioDto {

  @ApiProperty({ example: 120.0, description: 'Precio nuevo del producto (debe ser mayor a 0)' })
  @IsDefined({ message: 'El precio nuevo es obligatorio' })
  @IsNumber({}, { message: 'El precio nuevo debe ser un número' })
  @IsPositive({ message: 'El precio nuevo debe ser mayor a 0' })
  precio: number;

  @ApiPropertyOptional({ example: 'Aumento por inflación', description: 'Motivo del cambio de precio' })
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  motivo?: string;

  @ApiProperty({ example: 100.5, description: 'Costo en moneda local' })
  @IsOptional()
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @Min(0, { message: 'El costo debe ser mayor o igual a 0' })
  costo?: number;

  @ApiProperty({ example: 50.25, description: 'Costo en dólares' })
  @IsOptional()
  @IsNumber({}, { message: 'El costo en dólares debe ser un número' })
  @Min(0, { message: 'El costo en dólares debe ser mayor o igual a 0' })
  costoDolar?: number;

  @ApiProperty({ example: 50.25, description: 'Cotización del dólar' })
  @IsOptional()
  @IsNumber({}, { message: 'La cotización del dólar debe ser un número' })
  @Min(0, { message: 'La cotización del dólar debe ser mayor o igual a 0' })
  cotizacionDolar?: number;

  @ApiProperty({ example: 10, description: 'Porcentaje de aumento' })
  @IsOptional()
  @IsNumber({}, { message: 'El porcentaje debe ser un número' })
  @Min(0, { message: 'El porcentaje debe ser mayor o igual a 0' })
  porcentaje?: number;


  @ApiProperty({ example: 3, description: 'ID del usuario que realiza la actualización' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  usuarioId: number;
}