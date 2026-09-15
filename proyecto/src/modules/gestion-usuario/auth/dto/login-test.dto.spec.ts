// TEST
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { describe, expect, it } from '@jest/globals';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('debería fallar si el mail está vacío', async () => {
    const dto = plainToInstance(LoginDto, { mail: '', contrasena: '12345678', empresaId: 1 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('mail');
  });

  it('debería fallar si la contraseña está vacía', async () => {
    const dto = plainToInstance(LoginDto, { mail: 'test@test.com', contrasena: '', empresaId: 1 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('contrasena');
  });

  it('debería fallar si falta empresaId', async () => {
    const dto = plainToInstance(LoginDto, { mail: 'test@test.com', contrasena: '12345678' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'empresaId')).toBe(true);
  });

  it('debería pasar con datos válidos', async () => {
    const dto = plainToInstance(LoginDto, { mail: 'test@test.com', contrasena: '12345678', empresaId: 1 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});