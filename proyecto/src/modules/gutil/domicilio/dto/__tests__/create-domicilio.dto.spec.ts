import { CreateDomicilioDto } from '../create-domicilio.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('CreateDomicilioDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con todos los campos correctos', async () => {
      const data = {
        direccion: 'Calle Falsa 123',
        localidadId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });

    it('debería aceptar direcciones con diferentes formatos', async () => {
      const validDirecciones = [
        'Av. Siempre Viva 742',
        'Calle 123 esquina 456',
        'Barrio Los Olivos, Manzana A, Casa 5',
        'Ruta 9, Km 150',
        'José Hernández 123',
      ];

      for (const direccion of validDirecciones) {
        const data = {
          direccion,
          localidadId: 1,
        };
        await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
      }
    });

    it('debería aceptar localidadId de diferentes valores', async () => {
      const data = {
        direccion: 'Calle Test 123',
        localidadId: 999,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });
  });

  describe('Validación del campo direccion', () => {
    it('debería fallar si direccion está vacía', async () => {
      const data = {
        direccion: '',
        localidadId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'direccion',
      );
    });

    it('debería fallar si direccion no está presente', async () => {
      const data = {
        localidadId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'direccion',
      );
    });

    it('debería fallar si direccion no es un string', async () => {
      const data = {
        direccion: 123,
        localidadId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'direccion',
      );
    });

    it('debería fallar si direccion es null', async () => {
      const data = {
        direccion: null,
        localidadId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'direccion',
      );
    });

    it('debería fallar con solo espacios en blanco', async () => {
      const data = {
        direccion: '   ',
        localidadId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'direccion',
      );
    });

    it('debería fallar si es un array', async () => {
      const data = {
        direccion: ['Calle 123'],
        localidadId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'direccion',
      );
    });

    it('debería fallar si es un objeto', async () => {
      const data = {
        direccion: { calle: 'Test', numero: 123 },
        localidadId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'direccion',
      );
    });
  });

  describe('Validación del campo localidadId', () => {
    it('debería fallar si localidadId no está presente', async () => {
      const data = {
        direccion: 'Calle Test 123',
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'localidadId',
        'La localidad es obligatoria.',
      );
    });

    it('debería fallar si localidadId es null', async () => {
      const data = {
        direccion: 'Calle Test 123',
        localidadId: null,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'localidadId',
        'La localidad es obligatoria.',
      );
    });

    it('debería fallar si localidadId no es un entero', async () => {
      const data = {
        direccion: 'Calle Test 123',
        localidadId: 1.5,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'localidadId',
        'La localidad es obligatoria.',
      );
    });

    it('debería fallar si localidadId es un string', async () => {
      const data = {
        direccion: 'Calle Test 123',
        localidadId: '1',
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'localidadId',
      );
    });

    it('debería fallar si localidadId es un string numérico', async () => {
      const data = {
        direccion: 'Calle Test 123',
        localidadId: '123',
      };

      await DtoValidatorHelper.expectFieldError(
        CreateDomicilioDto,
        data,
        'localidadId',
      );
    });

    it('debería aceptar localidadId cero', async () => {
      const data = {
        direccion: 'Calle Test 123',
        localidadId: 0,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });

    it('debería aceptar localidadId negativos (dependiendo lógica de negocio)', async () => {
      const data = {
        direccion: 'Calle Test 123',
        localidadId: -1,
      };

      // La validación actual permite negativos
      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });

    it('debería aceptar localidadId grandes', async () => {
      const data = {
        direccion: 'Calle Test 123',
        localidadId: Number.MAX_SAFE_INTEGER,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });
  });

  describe('Casos extremos', () => {
    it('debería fallar con objeto vacío', async () => {
      const data = {};

      const errors = await DtoValidatorHelper.validateDto(
        CreateDomicilioDto,
        data,
      );
      expect(errors.length).toBe(2); // direccion y localidadId son requeridos
    });

    it('debería manejar direcciones muy largas', async () => {
      const data = {
        direccion: 'a'.repeat(1000),
        localidadId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });

    it('debería manejar direcciones con caracteres especiales', async () => {
      const data = {
        direccion: 'Av. José María O\'Higgins #1234, 2° piso, dto. "A"',
        localidadId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });

    it('debería manejar direcciones con números', async () => {
      const data = {
        direccion: '123 456 789',
        localidadId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });

    it('debería manejar direcciones con saltos de línea', async () => {
      const data = {
        direccion: 'Calle Principal\nEntre calles 1 y 2\nBarrio Centro',
        localidadId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });

    it('debería manejar caracteres Unicode', async () => {
      const data = {
        direccion: '北京市朝阳区 Building 123',
        localidadId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateDomicilioDto, data);
    });
  });
});
