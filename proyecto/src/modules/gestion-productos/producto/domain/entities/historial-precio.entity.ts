import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MonetarioColumn } from 'src/modules/common/decorators/monetario-column.decorator';
import { Producto } from './producto.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';

export enum TipoCambioPrecio {
  INDIVIDUAL = 'INDIVIDUAL',
  MASIVO = 'MASIVO',
}

@Entity('historial_precio')
export class HistorialPrecio {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z', description: 'Fecha del cambio de precio' })
  @Column({ type: 'timestamp' })
  fecha: Date;

  @ApiProperty({ example: 100.0, description: 'Precio anterior del producto' })
  @MonetarioColumn()
  precioAnterior: number;

  @ApiProperty({ example: 120.0, description: 'Precio nuevo del producto (debe ser > 0)' })
  @MonetarioColumn()
  precioNuevo: number;

  @ApiProperty({ example: 'Aumento por inflación', description: 'Motivo del cambio de precio', required: false })
  @Column({ type: 'text', nullable: true })
  motivo?: string;

  @ApiProperty({ enum: TipoCambioPrecio })
  @Column({ type: 'varchar', length: 12 })
  tipoCambio: TipoCambioPrecio;

  @ManyToOne(() => Producto, (producto) => producto.historialesPrecio)
  @JoinColumn({ name: 'producto_id' })
  @Index()
  producto: Producto;

  @Column({ type: 'int', name: 'producto_id' })
  productoId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date | null | undefined;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_created_id' })
  usuarioCreated: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_updated_id' })
  usuarioUpdated?: Usuario;

  @Column({ type: 'int', default: 0 })
  sistema: number;
}
