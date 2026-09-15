import { RegistrarUsuarioDto } from '../register.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('RegistrarUsuarioDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con todos los campos correctos', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        denominacion: 'Usuario Test',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });

    it('debería aceptar contraseñas de exactamente 8 caracteres', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: '12345678',
        rolId: 1,
        denominacion: 'Usuario Test',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });

    it('debería aceptar contraseñas largas', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'a'.repeat(100),
        rolId: 1,
        denominacion: 'Usuario Test',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });

    it('debería aceptar denominaciones con caracteres especiales', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        denominacion: 'José María Ñoño',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });

    it('debería aceptar diferentes formatos de email válidos', async () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.co.uk',
        'user+tag@example.com',
        'user_name@example.com',
      ];

      for (const mail of validEmails) {
        const data = {
          mail,
          contrasena: 'password123',
          rolId: 1,
          denominacion: 'Test User',
        };
        await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
      }
    });
  });

  describe('Validación del campo mail', () => {
    it('debería fallar si mail está vacío', async () => {
      const data = {
        mail: '',
        contrasena: 'password123',
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
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
      ];

      for (const mail of invalidEmails) {
        const data = {
          mail,
          contrasena: 'password123',
          rolId: 1,
          denominacion: 'Test User',
        };

        await DtoValidatorHelper.expectFieldError(
          RegistrarUsuarioDto,
          data,
          'mail',
        );
      }
    });

    it('debería fallar si mail no está presente', async () => {
      const data = {
        contrasena: 'password123',
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'mail',
      );
    });

    it('debería fallar si mail no es un string', async () => {
      const data = {
        mail: 123,
        contrasena: 'password123',
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'mail',
      );
    });

    it('debería fallar si mail es null', async () => {
      const data = {
        mail: null,
        contrasena: 'password123',
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
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
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'contrasena',
        'La contraseña no puede estar vacía.',
      );
    });

    it('debería fallar si contrasena tiene menos de 8 caracteres', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: '1234567',
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'contrasena',
        'La contraseña debe tener al menos 8 caracteres.',
      );
    });

    it('debería fallar si contrasena no está presente', async () => {
      const data = {
        mail: 'test@example.com',
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'contrasena',
      );
    });

    it('debería fallar si contrasena no es un string', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 12345678,
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'contrasena',
      );
    });

    it('debería fallar si contrasena es null', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: null,
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'contrasena',
      );
    });

    it('debería aceptar contraseñas con espacios si cumplen longitud mínima', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'pass word 123',
        rolId: 1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });
  });

  describe('Validación del campo rolId', () => {
    it('debería fallar si rolId está vacío', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: null,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'rolId',
        'El ID del rol no puede estar vacío.',
      );
    });

    it('debería fallar si rolId no está presente', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'rolId',
      );
    });

    it('debería fallar si rolId no es un número', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 'not a number',
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'rolId',
      );
    });

    it('debería fallar si rolId es un string numérico', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: '1',
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'rolId',
      );
    });

    it('debería aceptar rolId cero', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 0,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });

    it('debería aceptar rolId negativo', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: -1,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });
  });

  describe('Validación del campo denominacion', () => {
    it('debería fallar si denominacion está vacía', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        denominacion: '',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
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
        RegistrarUsuarioDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si denominacion no es un string', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        denominacion: 123,
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar si denominacion es null', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        denominacion: null,
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'denominacion',
      );
    });

    it('debería fallar con solo espacios en blanco', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        denominacion: '   ',
      };

      await DtoValidatorHelper.expectFieldError(
        RegistrarUsuarioDto,
        data,
        'denominacion',
      );
    });

    it('debería aceptar denominaciones largas', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: 1,
        denominacion: 'a'.repeat(1000),
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });
  });

  describe('Casos extremos', () => {
    it('debería fallar con objeto vacío', async () => {
      const data = {};

      const errors = await DtoValidatorHelper.validateDto(
        RegistrarUsuarioDto,
        data,
      );
      expect(errors.length).toBe(4); // Los 4 campos son requeridos
    });

    it('debería fallar si todos los campos están vacíos', async () => {
      const data = {
        mail: '',
        contrasena: '',
        rolId: null,
        denominacion: '',
      };

      const errors = await DtoValidatorHelper.validateDto(
        RegistrarUsuarioDto,
        data,
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it('debería manejar valores extremadamente grandes', async () => {
      const data = {
        mail: 'test@example.com',
        contrasena: 'password123',
        rolId: Number.MAX_SAFE_INTEGER,
        denominacion: 'Test User',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });

    it('debería manejar caracteres especiales en todos los campos de texto', async () => {
      const data = {
        mail: 'test+special@example.com',
        contrasena: 'P@ssw0rd!#$%',
        rolId: 1,
        denominacion: 'José María & Ñoño',
      };

      await DtoValidatorHelper.expectValidDto(RegistrarUsuarioDto, data);
    });
  });
});
