import { CreateProductoDto } from '../create-producto.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';
import { AlicuotaIva } from '../../../../organizacion/enums/alicuota-iva.enum';

describe('CreateProductoDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con todos los campos obligatorios', async () => {
      const data = {
        denominacion: 'Producto Test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100.50,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería transformar denominacion a lowercase', async () => {
      const data = {
        denominacion: 'PRODUCTO TEST',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería aceptar todos los campos opcionales', async () => {
      const data = {
        denominacion: 'producto completo',
        observacion: 'Observación del producto',
        codigoProveedor: 'PROV-001',
        codigoBarra: '1234567890123',
        codigoReferencia: 'REF-001',
        ubicacion: 'Estante A-1',
        utilizaStockMinimo: true,
        stockMinimo: 10,
        stock: 100,
        costoEnDolar: true,
        destacado: true,
        envioGratis: true,
        costo: 50.75,
        utilizaPack: true,
        cantidadPorPack: 12,
        costoDolar: 25.50,
        lineaId: 1,
        marcaId: 1,
        porcentaje: 30,
        precio: 100.50,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
        createdAt: new Date(),
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería aceptar denominaciones con caracteres válidos', async () => {
      const validDenominaciones = [
        'producto con espacios',
        'producto-con-guiones',
        'producto.con.puntos',
        'producto/con/barras',
        'producto%con%porcentaje',
        'josé maría ñoño',
        'PRODUCTO123',
      ];

      for (const denominacion of validDenominaciones) {
        const data = {
          denominacion,
          utilizaStockMinimo: false,
          utilizaPack: false,
          lineaId: 1,
          marcaId: 1,
          precio: 100,
          alicuotaIva: AlicuotaIva.ALICUOTA_21,
          usuarioCreatedId: 1,
        };
        await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
      }
    });

    it('debería transformar strings booleanos a booleanos', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        costoEnDolar: 'true',
        destacado: 'true',
        envioGratis: 'false',
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería aceptar todas las alicuotas IVA válidas', async () => {
      const alicuotas = [
        AlicuotaIva.ALICUOTA_0,
        AlicuotaIva.ALICUOTA_105,
        AlicuotaIva.ALICUOTA_21,
        AlicuotaIva.ALICUOTA_27,
      ];

      for (const alicuotaIva of alicuotas) {
        const data = {
          denominacion: 'producto test',
          utilizaStockMinimo: false,
          utilizaPack: false,
          lineaId: 1,
          marcaId: 1,
          precio: 100,
          alicuotaIva,
          usuarioCreatedId: 1,
        };
        await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
      }
    });
  });

  describe('Validación del campo denominacion', () => {
    it('debería fallar si denominacion está vacía', async () => {
      const data = {
        denominacion: '',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'denominacion',
        'La denominación no puede estar vacía.',
      );
    });

    it('debería ser válido si denominacion no está presente (se autogenera en el dominio)', async () => {
      const data = {
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería fallar si denominacion no es un string', async () => {
      const data = {
        denominacion: 123,
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si denominacion supera 255 caracteres', async () => {
      const data = {
        denominacion: 'a'.repeat(256),
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar con caracteres inválidos', async () => {
      const invalidDenominaciones = [
        'producto@test',
        'producto#test',
        'producto$test',
        'producto&test',
      ];

      for (const denominacion of invalidDenominaciones) {
        const data = {
          denominacion,
          utilizaStockMinimo: false,
          utilizaPack: false,
          lineaId: 1,
          marcaId: 1,
          precio: 100,
          alicuotaIva: AlicuotaIva.ALICUOTA_21,
          usuarioCreatedId: 1,
        };

        await DtoValidatorHelper.expectFieldError(
          CreateProductoDto,
          data,
          'denominacion',
          'La denominación contiene caracteres inválidos ',
        );
      }
    });
  });

  describe('Validación del campo utilizaStockMinimo', () => {
    it('debería fallar si utilizaStockMinimo no es booleano', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: 'not a boolean',
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'utilizaStockMinimo',
      );
    });

    it('debería fallar si utilizaStockMinimo no está presente', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'utilizaStockMinimo',
      );
    });
  });

  describe('Validación del campo utilizaPack', () => {
    it('debería fallar si utilizaPack no es booleano', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: 'not a boolean',
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'utilizaPack',
      );
    });

    it('debería fallar si utilizaPack no está presente', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'utilizaPack',
      );
    });
  });

  describe('Validación del campo lineaId', () => {
    it('debería fallar si lineaId no está presente', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'lineaId',
        'La linea es obligatoria.',
      );
    });

    it('debería fallar si lineaId no es un entero', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1.5,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'lineaId',
        'La linea  debe ser un número entero.',
      );
    });

    it('debería fallar si lineaId es string', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: '1',
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'lineaId',
      );
    });
  });

  describe('Validación del campo marcaId', () => {
    it('debería fallar si marcaId no está presente', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'marcaId',
        'La marca es obligatoria.',
      );
    });

    it('debería fallar si marcaId no es un entero', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1.5,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'marcaId',
        'La marca  debe ser un número entero.',
      );
    });
  });

  describe('Validación del campo alicuotaIva', () => {
    it('debería fallar si alicuotaIva no está presente', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'alicuotaIva',
      );
    });

    it('debería fallar con valor inválido de enum', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: 999,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'alicuotaIva',
        'tipo debe ser ALICUOTA_0  ALICUOTA_105, ALICUOTA_21, ALICUOTA_27,',
      );
    });
  });

  describe('Validación del campo usuarioCreatedId', () => {
    it('debería fallar si usuarioCreatedId no está presente', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'usuarioCreatedId',
        'El usuarioCreatedId es obligatorio.',
      );
    });

    it('debería fallar si usuarioCreatedId no es un entero', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1.5,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateProductoDto,
        data,
        'usuarioCreatedId',
        'El usuarioCreatedId debe ser un número entero.',
      );
    });
  });

  describe('Campos numéricos opcionales', () => {
    it('debería aceptar stockMinimo como entero', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: true,
        stockMinimo: 10,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería aceptar stock como entero', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        stock: 100,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería aceptar costo y costoDolar como números', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        costo: 50.75,
        costoDolar: 25.50,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        precio: 100.50,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería aceptar porcentaje como número', async () => {
      const data = {
        denominacion: 'producto test',
        utilizaStockMinimo: false,
        utilizaPack: false,
        lineaId: 1,
        marcaId: 1,
        porcentaje: 30,
        precio: 100,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });
  });

  describe('Casos extremos', () => {
    it('debería fallar con objeto vacío', async () => {
      const data = {};

      const errors = await DtoValidatorHelper.validateDto(
        CreateProductoDto,
        data,
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debería manejar producto con pack completo', async () => {
      const data = {
        denominacion: 'producto pack',
        utilizaStockMinimo: false,
        utilizaPack: true,
        cantidadPorPack: 24,
        lineaId: 1,
        marcaId: 1,
        precio: 1200,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });

    it('debería manejar precios con decimales', async () => {
      const data = {
        denominacion: 'producto decimal',
        utilizaStockMinimo: false,
        utilizaPack: false,
        costo: 99.99,
        precio: 149.99,
        lineaId: 1,
        marcaId: 1,
        alicuotaIva: AlicuotaIva.ALICUOTA_21,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateProductoDto, data);
    });
  });
});
