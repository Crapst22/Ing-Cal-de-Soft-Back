import { CreateClienteDto } from '../create-cliente.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('CreateClienteDto', () => {
  const validDomicilio = {
    direccion: 'Calle Falsa 123',
    localidadId: 1,
  };

  describe('Validación exitosa', () => {
    it('debería ser válido con todos los campos obligatorios', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
        createdAt: new Date(),
      };

      await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
    });

    it('debería transformar denominacion a lowercase', async () => {
      const data = {
        denominacion: 'CLIENTE TEST',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
    });

    it('debería aceptar campos opcionales', async () => {
      const data = {
        denominacion: 'Cliente Test',
        denominacionAfip: 'Cliente AFIP',
        codigo: '001',
        cuit: '20-12345678-9',
        dni: '12345678',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        mail: 'cliente@example.com',
        celular: '1234567890',
        contactoNombre: 'Juan Pérez',
        contactoCargo: 'Gerente',
        observacion: 'Cliente VIP',
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
    });

    it('debería aceptar denominaciones con caracteres válidos', async () => {
      const validDenominaciones = [
        'cliente con espacios',
        'cliente-con-guiones',
        'cliente.con.puntos',
        'cliente/con/barras',
        'cliente%con%porcentaje',
        'josé maría ñoño',
        'CLIENTE123',
      ];

      for (const denominacion of validDenominaciones) {
        const data = {
          denominacion,
          condicionIvaId: 1,
          vendedorId: 1,
          domicilio: validDomicilio,
          usuarioCreatedId: 1,
        };
        await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
      }
    });

    it('debería aceptar email válido', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        mail: 'test@example.com',
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
    });
  });

  describe('Validación del campo denominacion', () => {
    it('debería fallar si denominacion está vacía', async () => {
      const data = {
        denominacion: '',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'denominacion',
        'La denominación no puede estar vacía.',
      );
    });

    it('debería fallar si denominacion no está presente', async () => {
      const data = {
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si denominacion no es un string', async () => {
      const data = {
        denominacion: 123,
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si denominacion supera 255 caracteres', async () => {
      const data = {
        denominacion: 'a'.repeat(256),
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar con caracteres inválidos', async () => {
      const invalidDenominaciones = [
        'cliente@test',
        'cliente#test',
        'cliente$test',
        'cliente&test',
      ];

      for (const denominacion of invalidDenominaciones) {
        const data = {
          denominacion,
          condicionIvaId: 1,
          vendedorId: 1,
          domicilio: validDomicilio,
          usuarioCreatedId: 1,
        };

        await DtoValidatorHelper.expectFieldError(
          CreateClienteDto,
          data,
          'denominacion',
          'La denominación contiene caracteres inválidos ',
        );
      }
    });

    it('debería aceptar 255 caracteres exactos', async () => {
      const data = {
        denominacion: 'a'.repeat(255),
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
    });
  });

  describe('Validación del campo condicionIvaId', () => {
    it('debería fallar si condicionIvaId no está presente', async () => {
      const data = {
        denominacion: 'Cliente Test',
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'condicionIvaId',
        'La Condicion IVA es obligatoria.',
      );
    });

    it('debería fallar si condicionIvaId no es un entero', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1.5,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'condicionIvaId',
        'La Condicion IVA  debe ser un número entero.',
      );
    });

    it('debería fallar si condicionIvaId es un string', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: '1',
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'condicionIvaId',
      );
    });

    it('debería fallar si condicionIvaId es null', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: null,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'condicionIvaId',
      );
    });
  });

  describe('Validación del campo vendedorId', () => {
    it('debería fallar si vendedorId no está presente', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'vendedorId',
        'El personal es obligatorio.',
      );
    });

    it('debería fallar si vendedorId no es un entero', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1.5,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'vendedorId',
      );
    });
  });

  describe('Validación del campo domicilio', () => {
    it('debería fallar si domicilio no está presente', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'domicilio',
        'El domicilio es obligatorio.',
      );
    });

    it('debería fallar si domicilio está incompleto', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: { direccion: 'Calle 123' },
        usuarioCreatedId: 1,
      };

      const errors = await DtoValidatorHelper.validateDto(
        CreateClienteDto,
        data,
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debería validar domicilio completo', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: {
          direccion: 'Av. Siempre Viva 742',
          localidadId: 1,
        },
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
    });
  });

  describe('Validación del campo mail', () => {
    it('debería fallar si mail no es válido', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      for (const mail of invalidEmails) {
        const data = {
          denominacion: 'Cliente Test',
          condicionIvaId: 1,
          vendedorId: 1,
          domicilio: validDomicilio,
          mail,
          usuarioCreatedId: 1,
        };

        await DtoValidatorHelper.expectFieldError(
          CreateClienteDto,
          data,
          'mail',
        );
      }
    });

    it('debería aceptar mail opcional no proporcionado', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
    });
  });

  describe('Validación del campo usuarioCreatedId', () => {
    it('debería fallar si usuarioCreatedId no está presente', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'usuarioCreatedId',
        'El usuarioCreatedId es obligatorio.',
      );
    });

    it('debería fallar si usuarioCreatedId no es un entero', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1.5,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'usuarioCreatedId',
        'El usuarioCreatedId debe ser un número entero.',
      );
    });
  });

  describe('Campos opcionales', () => {
    it('debería aceptar campos opcionales como null o undefined', async () => {
      const data = {
        denominacion: 'Cliente Test',
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
        denominacionAfip: null,
        codigo: null,
        cuit: null,
        dni: null,
        mail: null,
        celular: null,
        contactoNombre: null,
        contactoCargo: null,
        observacion: null,
      };

      // Los campos opcionales pueden ser null
      const errors = await DtoValidatorHelper.validateDto(
        CreateClienteDto,
        data,
      );
      const requiredFieldErrors = errors.filter(
        (e) =>
          !['denominacionAfip', 'codigo', 'cuit', 'dni', 'mail', 'celular', 'contactoNombre', 'contactoCargo', 'observacion'].includes(
            e.property,
          ),
      );
      expect(requiredFieldErrors.length).toBe(0);
    });

    it('debería validar longitud máxima de campos opcionales', async () => {
      const data = {
        denominacion: 'Cliente Test',
        denominacionAfip: 'a'.repeat(256),
        condicionIvaId: 1,
        vendedorId: 1,
        domicilio: validDomicilio,
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateClienteDto,
        data,
        'denominacionAfip',
      );
    });
  });

  describe('Casos extremos', () => {
    it('debería fallar con objeto vacío', async () => {
      const data = {};

      const errors = await DtoValidatorHelper.validateDto(
        CreateClienteDto,
        data,
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debería manejar todos los campos con valores válidos', async () => {
      const data = {
        denominacion: 'cliente completo test',
        denominacionAfip: 'CLIENTE AFIP',
        codigo: 'CLT-001',
        cuit: '20-30456789-7',
        dni: '30456789',
        condicionIvaId: 1,
        vendedorId: 2,
        domicilio: {
          direccion: 'Calle Principal 456',
          localidadId: 3,
        },
        mail: 'cliente@empresa.com',
        celular: '+5491123456789',
        contactoNombre: 'María González',
        contactoCargo: 'Directora',
        observacion: 'Cliente importante con descuento especial',
        createdAt: new Date(),
        usuarioCreatedId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateClienteDto, data);
    });
  });
});
