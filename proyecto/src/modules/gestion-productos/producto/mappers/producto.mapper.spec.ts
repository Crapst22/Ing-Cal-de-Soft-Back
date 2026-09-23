import { ProductoMapper } from './producto.mapper';

describe('ProductoMapper', () => {
  describe('toBusquedaDto', () => {
    it('mapea campos y calcula precio con IVA', () => {
      const producto = {
        id: 9,
        denominacion: 'caroyense aceites pack x6 de 500ml',
        observacion: null,
        codigoProveedor: 'PROV-1',
        stock: 10,
        alicuotaIva: 21,
        costo: 100,
        precio: 200,
        ubicacion: null,
        utilizaStockMinimo: false,
        stockMinimo: 0,
        utilizaPack: true,
        cantidadPorPack: 6,
        sistema: 0,
        codigoReferencia: null,
        presentacion: {
          id: 1,
          tipo: 'pack',
          quantity: 6,
          volumen: 500,
          unidad: 'ml',
        },
      } as any;

      const dto = ProductoMapper.toBusquedaDto(producto);

      expect(dto.denominacion).toBe('caroyense aceites pack x6 de 500ml');
      expect(dto.precio).toBe(200);
      expect(dto.precioConIva).toBe(242);
      expect(dto.codigoProveedorDenominacion).toBe(
        'PROV-1 - caroyense aceites pack x6 de 500ml',
      );
      expect(dto.presentacion).toEqual({ id: 1, denominacion: 'Pack x6 de 500ml' });
    });

    it('usa valores por defecto y omita la presentación ausente', () => {
      const dto = ProductoMapper.toBusquedaDto({
        id: 1,
        denominacion: 'x',
        precio: null,
        alicuotaIva: null,
      } as any);

      expect(dto.precio).toBe(0);
      expect(dto.alicuota).toBe(0);
      expect(dto.precioConIva).toBe(0);
      expect(dto.presentacion).toBeUndefined();
    });
  });

  describe('mapPrecios', () => {
    it('setea precios, fechas y usuario', () => {
      const producto = {} as any;
      const usuario = { id: 1 } as any;

      ProductoMapper.mapPrecios(
        producto,
        { costo: 50, costoDolar: 25, cotizacionDolar: 1200 } as any,
        usuario,
      );

      expect(producto.costo).toBe(50);
      expect(producto.costoDolar).toBe(25);
      expect(producto.cotizacionDolar).toBe(1200);
      expect(producto.fechaCosto).toBeInstanceOf(Date);
      expect(producto.fechaCostoDolar).toBeInstanceOf(Date);
      expect(producto.usuarioUpdated).toEqual(usuario);
    });
  });

  describe('toDto', () => {
    it('mapea el producto completo incluyendo presentación', () => {
      const dto = ProductoMapper.toDto({
        id: 9,
        denominacion: 'caroyense aceites 1l',
        observacion: 'obs',
        codigoProveedor: 'PROV-1',
        codigoBarra: '123',
        stock: 5,
        costo: 50,
        precio: 100,
        porcentaje: 10,
        costoEnDolar: true,
        costoDolar: 1,
        cotizacionDolar: 1200,
        precioDolar: 2,
        destacado: true,
        envioGratis: false,
        linea: { id: 1, denominacion: 'Aceites' },
        marca: { id: 1, denominacion: 'Caroyense' },
        presentacion: {
          id: 2,
          tipo: 'volume',
          quantity: null,
          volumen: 1,
          unidad: 'l',
        },
        alicuotaIva: 21,
        ubicacion: 'A1',
        utilizaStockMinimo: true,
        stockMinimo: 5,
        utilizaPack: false,
        cantidadPorPack: 0,
        sistema: 0,
        codigoReferencia: 'REF',
      } as any);

      expect(dto.denominacion).toBe('caroyense aceites 1l');
      expect(dto.presentacion).toEqual({ id: 2, denominacion: '1l' });
      expect(dto.linea).toEqual({ id: 1, denominacion: 'Aceites' });
      expect(dto.marca).toEqual({ id: 1, denominacion: 'Caroyense' });
      expect(dto.alicuotaIva).toBe(21);
    });

    it('aplica defaults de campos opcionales y quita la presentación ausente', () => {
      const dto = ProductoMapper.toDto({
        id: 1,
        denominacion: 'x',
        linea: { id: 1, denominacion: 'Aceites' },
        marca: { id: 1, denominacion: 'Caroyense' },
      } as any);

      expect(dto.observacion).toBe('');
      expect(dto.stock).toBe(0);
      expect(dto.costo).toBe(0);
      expect(dto.presentacion).toBeUndefined();
      expect(dto.utilizaStockMinimo).toBe(false);
    });
  });
});