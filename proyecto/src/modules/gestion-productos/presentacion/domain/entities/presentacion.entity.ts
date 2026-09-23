import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Producto } from '../../../producto/domain/entities/producto.entity';

@Entity('presentacion')
export class Presentacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, default: 'pack' })
  tipo: 'volume' | 'pack';

  @Column({ type: 'int', nullable: true })
  quantity?: number | null;

  @Column('decimal', {
    name: 'volumen',
    precision: 12,
    scale: 3,
    nullable: true,
    transformer: {
      to: (value: number | string | null | undefined): string | null =>
        value != null && value !== '' ? String(Number(value)) : null,
      from: (value: string | null): number | null =>
        value != null ? Number(value) : null,
    },
  })
  volumen?: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unidad?: string | null;

  @OneToMany(() => Producto, (producto) => producto.presentacion)
  productos: Producto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ type: 'int', nullable: true })
  usuarioCreatedId?: number;

  @Column({ type: 'int', nullable: true })
  usuarioDeletedId?: number;

  @Column({ type: 'int', nullable: true })
  usuarioUpdatedId?: number;

  @Column({ type: 'int', default: 0 })
  sistema: number;
}