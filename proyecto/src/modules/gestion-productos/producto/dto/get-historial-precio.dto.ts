import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetHistorialPrecioDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 7 })
  productoId: number;

  @ApiProperty({ example: 'Producto de ejemplo' })
  denominacion: string;

  @ApiProperty({ example: 100.0, description: 'Precio anterior del producto' })
  precioAnterior: number;

  @ApiProperty({ example: 120.0, description: 'Precio nuevo del producto' })
  precioNuevo: number;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z', description: 'Fecha del cambio de precio' })
  fecha: Date;

  @ApiPropertyOptional({ example: 'Aumento por inflación', description: 'Motivo del cambio de precio' })
  motivo?: string;
}