import { LoginDto } from '../login.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('LoginDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con todos los campos correctos', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectValidDto(LoginDto, data);
    });

    it('debería aceptar emails válidos', async () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.co.uk',
        'user+tag@example.com',
        'user_name@example.com',
        '123@example.com',
      ];

      for (const mail of validEmails) {
        const data = {
          mail,
          contrasena: 'password123',
          empresaId: 1,
        };
        await DtoValidatorHelper.expectValidDto(LoginDto, data);
      }
    });

    it('debería aceptar contraseñas de cualquier longitud', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'a',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectValidDto(LoginDto, data);
    });

    it('debería aceptar empresaId numéricos', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password',
        empresaId: 999,
      };

      await DtoValidatorHelper.expectValidDto(LoginDto, data);
    });

    it('debería aceptar contraseñas con caracteres especiales', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'P@ssw0rd!#$%',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectValidDto(LoginDto, data);
    });
  });

  describe('Validación del campo mail', () => {
    it('debería fallar si mail está vacío', async () => {
      const data = {
        mail: '',
        contrasena: 'password123',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'mail',
        'El mail no puede estar vacío.',
      );
    });

    it('debería fallar si mail no está presente', async () => {
      const data = {
        contrasena: 'password123',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'mail',
      );
    });

    it('debería fallar si mail no es un string', async () => {
      const data = {
        mail: 123,
        contrasena: 'password123',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'mail',
      );
    });

    it('debería fallar si mail es null', async () => {
      const data = {
        mail: null,
        contrasena: 'password123',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'mail',
      );
    });

    it('debería fallar si mail es undefined', async () => {
      const data = {
        mail: undefined,
        contrasena: 'password123',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'mail',
      );
    });

    it('debería fallar con solo espacios en blanco', async () => {
      const data = {
        mail: '   ',
        contrasena: 'password123',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'mail',
      );
    });
  });

  describe('Validación del campo contrasena', () => {
    it('debería fallar si contrasena está vacía', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: '',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'contrasena',
        'La contraseña no puede estar vacía.',
      );
    });

    it('debería fallar si contrasena no está presente', async () => {
      const data = {
        mail: 'test@example.com',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'contrasena',
      );
    });

    it('debería fallar si contrasena no es un string', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 12345678,
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'contrasena',
      );
    });

    it('debería fallar si contrasena es null', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: null,
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'contrasena',
      );
    });

    it('debería fallar con solo espacios en blanco', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: '   ',
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'contrasena',
      );
    });

    it('debería fallar si contrasena es un objeto', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: { value: 'password' },
        empresaId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'contrasena',
      );
    });
  });

  describe('Validación del campo empresaId', () => {
    it('debería fallar si empresaId está vacío', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        empresaId: null,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'empresaId',
        'El id de la empresa no puede estar vacío.',
      );
    });

    it('debería fallar si empresaId no está presente', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'empresaId',
      );
    });

    it('debería fallar si empresaId no es un número', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        empresaId: 'not a number',
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'empresaId',
      );
    });

    it('debería fallar si empresaId es un string', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        empresaId: '1',
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'empresaId',
      );
    });

    it('debería fallar si empresaId es undefined', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        empresaId: undefined,
      };

      await DtoValidatorHelper.expectFieldError(
        LoginDto,
        data,
        'empresaId',
      );
    });

    it('debería manejar empresaId cero', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        empresaId: 0,
      };

      await DtoValidatorHelper.expectValidDto(LoginDto, data);
    });

    it('debería manejar empresaId negativo', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        empresaId: -1,
      };

      await DtoValidatorHelper.expectValidDto(LoginDto, data);
    });
  });

  describe('Casos extremos', () => {
    it('debería manejar todos los campos con valores extremos', async () => {
      const data = {
        mail: 'a@b.c',
        contrasena: 'x',
        empresaId: Number.MAX_SAFE_INTEGER,
      };

      await DtoValidatorHelper.expectValidDto(LoginDto, data);
    });

    it('debería fallar si todos los campos están vacíos', async () => {
      const data = {
        mail: '',
        contrasena: '',
        empresaId: null,
      };

      const errors = await DtoValidatorHelper.validateDto(LoginDto, data);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'mail')).toBe(true);
      expect(errors.some((e) => e.property === 'contrasena')).toBe(true);
      expect(errors.some((e) => e.property === 'empresaId')).toBe(true);
    });

    it('debería fallar con objeto vacío', async () => {
      const data = {};

      const errors = await DtoValidatorHelper.validateDto(LoginDto, data);
      expect(errors.length).toBe(3); // Los 3 campos son requeridos
    });

    it('debería manejar contraseñas muy largas', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'a'.repeat(10000),
        empresaId: 1,
      };

      await DtoValidatorHelper.expectValidDto(LoginDto, data);
    });
  });
});
