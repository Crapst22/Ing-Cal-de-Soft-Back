import { Injectable } from '@nestjs/common';
import { Linea } from '../../../linea/domain/entities/linea.entity';
import { Marca } from '../../../marca/domain/entities/marca.entity';
import { Presentacion } from '../../../presentacion/domain/entities/presentacion.entity';
import { generarDenominacionPresentacion } from '../../../presentacion/domain/value-objects/denominacion-presentacion';

/**
 * Regla de negocio (Domain) de la denominación automática de un producto.
 *
 * Si el usuario no ingresa una denominación explícita ("editable manualmente"),
 * se compone como: Marca + Línea + Presentación.
 */
@Injectable()
export class ProductoDenominacionService {
  generarDenominacion(params: {
    marca: Marca;
    linea: Linea;
    presentacion: Presentacion | null;
  }): string {
    const { marca, linea, presentacion } = params;
    const partes = [marca.denominacion, linea.denominacion];

    if (presentacion) {
      partes.push(
        generarDenominacionPresentacion(
          presentacion.tipo,
          presentacion.quantity,
          presentacion.volumen,
          presentacion.unidad,
        ),
      );
    }

    return partes
      .map((parte) => (parte || '').trim())
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  resolverDenominacion(params: {
    manual?: string | null;
    marca: Marca;
    linea: Linea;
    presentacion: Presentacion | null;
  }): string {
    const manual = params.manual?.trim();
    if (manual) return manual.toLowerCase().replace(/\s+/g, ' ');

    return this.generarDenominacion({
      marca: params.marca,
      linea: params.linea,
      presentacion: params.presentacion,
    });
  }
}