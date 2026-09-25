import { HistorialPrecioMapper } from './historial-precio.mapper';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { HistorialPrecio, TipoCambioPrecio } from '../domain/entities/historial-precio.entity';
import { Producto } from '../domain/entities/producto.entity';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';

describe('HistorialPrecioMapper (CR-007 Historial de precios)', () => {
  const crearUsuario = (id = 3): Usuario => {
    const usuario = new Usuario();
    usuario.id = id;
    usuario.denominacion = `Empleado-${id}`;
    return usuario;
  };

  const crearProducto = (precio = 100): Producto => {
    const producto = new Producto();
    producto.id = 7;
    producto.denominacion = 'Producto CR-007';
    producto.precio = precio;
    return producto;
  };

  it('debe registrar el historial con todos los datos: precio anterior, precio nuevo, fecha, motivo, producto y usuario', () => {
    const producto = crearProducto(100);
    const usuario = crearUsuario(9);
    const fecha = new Date('2025-01-15T10:00:00.000Z');

    const historial: HistorialPrecio = HistorialPrecioMapper.toEntity({
      producto,
      precioAnterior: 100,
      precioNuevo: 125.5,
      fecha,
      motivo: 'Aumento por inflación',
      usuario,
      tipoCambio: TipoCambioPrecio.INDIVIDUAL,
    });

    expect(historial).toBeInstanceOf(HistorialPrecio);
    expect(historial.precioAnterior).toBe(100);
    expect(historial.precioNuevo).toBe(125.5);
    expect(historial.fecha).toBe(fecha);
    expect(historial.motivo).toBe('Aumento por inflación');
    expect(historial.producto).toBe(producto);
    expect(historial.productoId).toBe(7);
    expect(historial.usuarioCreated).toBe(usuario);
    expect(historial.tipoCambio).toBe(TipoCambioPrecio.INDIVIDUAL);
  });

  it('debe funcionar con motivo opcional (sin motivo)', () => {
    const producto = crearProducto();
    const usuario = crearUsuario();

    const historial = HistorialPrecioMapper.toEntity({
      producto,
      precioAnterior: 80,
      precioNuevo: 80,
      fecha: new Date('2025-03-01T00:00:00.000Z'),
      usuario,
      tipoCambio: TipoCambioPrecio.MASIVO,
    });

    expect(historial.motivo).toBeUndefined();
    expect(historial.precioAnterior).toBe(80);
    expect(historial.precioNuevo).toBe(80);
    expect(historial.tipoCambio).toBe(TipoCambioPrecio.MASIVO);
  });
});
