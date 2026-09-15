import { CreateUsuarioDto } from '../create-usuario.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('CreateUsuarioDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con todos los campos correctos', async () => {
      const data = {
        denominacion: 'Usuario Test',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        createdAt: new Date(),
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería ser válido sin createdAt (opcional)', async () => {
      const data = {
        denominacion: 'Usuario Test',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería aceptar denominaciones con caracteres válidos', async () => {
      const data = {
        denominacion: 'José María Ñoño 123',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería aceptar contraseñas de 8 caracteres o más', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: '12345678',
        rolId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería aceptar diferentes roles', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 999,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });
  });

  describe('Validación del campo denominacion', () => {
    it('debería fallar si denominacion está vacía', async () => {
      const data = {
        denominacion: '',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'denominacion',
        'La denominación no puede estar vacía.',
      );
    });

    it('debería fallar si denominacion no está presente', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si denominacion no es un string', async () => {
      const data = {
        denominacion: 123,
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'denominacion',
        'La denominación debe ser un texto',
      );
    });

    it('debería fallar si denominacion es null', async () => {
      const data = {
        denominacion: null,
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar con solo espacios en blanco', async () => {
      const data = {
        denominacion: '   ',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si es un array', async () => {
      const data = {
        denominacion: ['test'],
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si es un objeto', async () => {
      const data = {
        denominacion: { value: 'test' },
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'denominacion',
      );
    });
  });

  describe('Validación del campo mail', () => {
    it('debería fallar si mail está vacío', async () => {
      const data = {
        denominacion: 'Test User',
        mail: '',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'mail',
        'El correo electrónico no puede estar vacío.',
      );
    });

    it('debería fallar si mail no es válido', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
        'user..name@example.com',
      ];

      for (const mail of invalidEmails) {
        const data = {
          denominacion: 'Test User',
          mail,
          contrasena: 'password123',
          rolId: 1,
        };

        await DtoValidatorHelper.expectFieldError(
          CreateUsuarioDto,
          data,
          'mail',
          'El correo electrónico debe ser un correo válido',
        );
      }
    });

    it('debería fallar si mail no está presente', async () => {
      const data = {
        denominacion: 'Test User',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'mail',
      );
    });

    it('debería fallar si mail es null', async () => {
      const data = {
        denominacion: 'Test User',
        mail: null,
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'mail',
      );
    });

    it('debería aceptar emails válidos', async () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.co.uk',
        'user+tag@example.com',
        'user_name@example.com',
        '123@example.com',
        'user@subdomain.example.com',
      ];

      for (const mail of validEmails) {
        const data = {
          denominacion: 'Test User',
          mail,
          contrasena: 'password123',
          rolId: 1,
        };
        await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
      }
    });
  });

  describe('Validación del campo contrasena', () => {
    it('debería fallar si contrasena está vacía', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: '',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'contrasena',
        'La contraseña no puede estar vacía.',
      );
    });

    it('debería fallar si contrasena tiene menos de 8 caracteres', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: '1234567',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'contrasena',
        'La contraseña debe tener al menos 8 caracteres.',
      );
    });

    it('debería fallar si contrasena no está presente', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'contrasena',
      );
    });

    it('debería fallar si contrasena no es un string', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 12345678,
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'contrasena',
      );
    });

    it('debería fallar si contrasena es null', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: null,
        rolId: 1,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'contrasena',
      );
    });

    it('debería aceptar contraseñas con caracteres especiales', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'P@ssw0rd!#$%',
        rolId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería aceptar contraseñas largas', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'a'.repeat(100),
        rolId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería aceptar exactamente 8 caracteres', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: '12345678',
        rolId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });
  });

  describe('Validación del campo rolId', () => {
    it('debería fallar si rolId está vacío', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: null,
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'rolId',
        'El ID del rol no puede estar vacío.',
      );
    });

    it('debería fallar si rolId no está presente', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'password123',
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'rolId',
      );
    });

    it('debería fallar si rolId no es un número', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 'not a number',
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'rolId',
      );
    });

    it('debería fallar si rolId es un string numérico', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: '1',
      };

      await DtoValidatorHelper.expectFieldError(
        CreateUsuarioDto,
        data,
        'rolId',
      );
    });

    it('debería aceptar rolId cero', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 0,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería aceptar rolId grandes', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: Number.MAX_SAFE_INTEGER,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });
  });

  describe('Casos extremos', () => {
    it('debería fallar con objeto vacío', async () => {
      const data = {};

      const errors = await DtoValidatorHelper.validateDto(
        CreateUsuarioDto,
        data,
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'denominacion')).toBe(true);
      expect(errors.some((e) => e.property === 'mail')).toBe(true);
      expect(errors.some((e) => e.property === 'contrasena')).toBe(true);
      expect(errors.some((e) => e.property === 'rolId')).toBe(true);
    });

    it('debería manejar createdAt como Date', async () => {
      const data = {
        denominacion: 'Test User',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        createdAt: new Date('2024-01-01'),
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería manejar todos los campos con valores extremos', async () => {
      const data = {
        denominacion: 'a'.repeat(1000),
        mail: 'test@example.com',
        contrasena: 'a'.repeat(1000),
        rolId: Number.MAX_SAFE_INTEGER,
        createdAt: new Date(),
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });

    it('debería manejar caracteres Unicode', async () => {
      const data = {
        denominacion: '用户测试 ユーザー 사용자',
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
      };

      await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
    });
  });
});
