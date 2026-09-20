// infrastructure/validators/producto-related-entities.validator.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MarcaService } from '../../../marca/application/services/marca.service';
import { LineaService } from '../../../linea/application/services/linea.service';
import { PresentacionService } from '../../../presentacion/application/services/presentacion.service';

@Injectable()
export class ProductoRelatedEntitiesValidator {
  constructor(
    private readonly marcaService: MarcaService,
    private readonly lineaService: LineaService,
    private readonly presentacionService: PresentacionService,
  ) {}

  /**
   * Valida que todas las entidades relacionadas existan en la DB
   * y las retorna para su uso posterior
   */
  async validarYObtenerEntidadesRelacionadas(
    marcaId: number,
    lineaId: number,
    presentacionId?: number | null,
  ) {
    let marca, linea, presentacion;

    // Sin sublínea
    [marca, linea] = await Promise.all([
      this.marcaService.findEntityById(marcaId),
      this.lineaService.findEntityById(lineaId),
    ]);

    if (presentacionId != null) {
      presentacion =
        await this.presentacionService.findEntityById(presentacionId);
      this.validarEntidadExiste(presentacion, 'Presentación', presentacionId);
    }

    // Validar que existen
    this.validarEntidadExiste(marca, 'Marca', marcaId);
    this.validarEntidadExiste(linea, 'Línea', lineaId);

    return { marca, linea, presentacion };
  }

  private validarEntidadExiste(
    entidad: any,
    tipo: string,
    id: number,
  ): void {
    if (!entidad) {
      throw new NotFoundException(`${tipo} con ID ${id} no encontrada`);
    }
  }
}