import { Presentacion } from '../domain/entities/presentacion.entity';
import { PresentacionDto } from '../dto/presentacion.dto';
import { generarDenominacionPresentacion } from '../utils/presentacion.util';

export class PresentacionMapper {
  static toDto(entity: Presentacion): PresentacionDto {
    return {
      id: entity.id,
      tipo: entity.tipo,
      quantity: entity.quantity ?? null,
      volumen: entity.volumen ?? null,
      unidad: entity.unidad ?? null,
      denominacion: generarDenominacionPresentacion(
        entity.tipo,
        entity.quantity,
        entity.volumen,
        entity.unidad,
      ),
      sistema: entity.sistema,
      deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
    };
  }
}