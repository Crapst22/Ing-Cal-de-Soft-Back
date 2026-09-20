import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';
import { UpdatePresentacionDto } from '../../dto/update-presentacion.dto';
import { Presentacion } from '../entities/presentacion.entity';

export interface IPresentacionRepository {
  create(data: CreatePresentacionDto): Promise<Presentacion>;

  findBy(
    denominacion: string,
    skip: number,
    take: number,
    incluirEliminados: boolean,
  ): Promise<{ data: Presentacion[]; total: number }>;

  findAllListado(): Promise<Presentacion[]>;

  findAllFor(denominacion: string): Promise<Presentacion[]>;

  findByIdConAuditoria(id: number): Promise<AuditoriaDto | null>;

  findOne(id: number): Promise<Presentacion | null>;

  update(id: number, data: UpdatePresentacionDto): Promise<Presentacion>;

  remove(data: Presentacion, usuario: Usuario): Promise<Presentacion>;
}