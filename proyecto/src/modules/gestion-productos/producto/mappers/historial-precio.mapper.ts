import { HistorialPrecio } from '../domain/entities/historial-precio.entity';
import { Producto } from '../domain/entities/producto.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { GetHistorialPrecioDto } from '../dto/get-historial-precio.dto';

export class HistorialPrecioMapper {
  /**
   * Construye un registro de historial de precio a partir de los datos del cambio.
   * Se registra como historial SEPARADO (sin modificar el flujo actualizarPrecio):
   * precioAnterior, precioNuevo, fecha, motivo y usuario que realizó el cambio.
   */
  static toEntity(datos: {
    producto: Producto;
    precioAnterior: number;
    precioNuevo: number;
    fecha?: Date;
    motivo?: string;
    usuario: Usuario;
  }): HistorialPrecio {
    const historial = new HistorialPrecio();
    historial.producto = datos.producto;
    historial.productoId = datos.producto.id;
    historial.precioAnterior = datos.precioAnterior;
    historial.precioNuevo = datos.precioNuevo;
    historial.fecha = datos.fecha ?? new Date();
    historial.motivo = datos.motivo;
    historial.usuarioCreated = datos.usuario;
    return historial;
  }

  static toDto(entity: HistorialPrecio): GetHistorialPrecioDto {
    const dto = new GetHistorialPrecioDto();
    dto.id = entity.id;
    dto.productoId = entity.productoId;
    dto.denominacion = entity.producto?.denominacion;
    dto.precioAnterior = entity.precioAnterior;
    dto.precioNuevo = entity.precioNuevo;
    dto.fecha = entity.fecha;
    dto.motivo = entity.motivo;
    return dto;
  }
}
