import { Logger } from '@nestjs/common';
import { SuperLinea } from '../domain/entities/superlinea.entity';
import { SuperLineaDto } from '../dto/superlinea.dto';

export class SuperLineaMapper {
  private static readonly logger = new Logger(SuperLineaMapper.name);

  static toDto(entity: SuperLinea): SuperLineaDto {
    return {
      id: entity.id,
      denominacion: entity.denominacion,
      observacion: entity.observacion ?? '',
      sistema: entity.sistema,
      deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
    };
  }
}