// TEST
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { describe, expect, it } from '@jest/globals';
import { CambiarContrasenaDto } from './cambiar-contrasena.dto';

describe('CambiarContrasenaDto', () => {
  it('debería fallar si el mail está vacío', async () => {
    const dto = plainToInstance(CambiarContrasenaDto, {
      mail: '',
      nuevaContrasena: '12345678',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'mail')).toBe(true);
  });

  it('debería fallar si nuevaContrasena está vacía', async () => {
    const dto = plainToInstance(CambiarContrasenaDto, {
      mail: 'juan@test.com',
      nuevaContrasena: '',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'nuevaContrasena')).toBe(true);
  });

  it('debería pasar con datos válidos', async () => {
    const dto = plainToInstance(CambiarContrasenaDto, {
      mail: 'juan@test.com',
      nuevaContrasena: '12345678',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});