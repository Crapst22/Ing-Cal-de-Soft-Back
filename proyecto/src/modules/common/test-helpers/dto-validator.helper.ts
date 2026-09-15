import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Helper para validar DTOs en tests
 */
export class DtoValidatorHelper {
  /**
   * Valida un DTO y retorna los errores
   */
  static async validateDto<T extends object>(
    dtoClass: new () => T,
    data: any,
  ): Promise<ValidationError[]> {
    const dtoInstance = plainToClass(dtoClass, data);
    return await validate(dtoInstance);
  }

  /**
   * Valida que un DTO sea válido (sin errores)
   */
  static async expectValidDto<T extends object>(
    dtoClass: new () => T,
    data: any,
  ): Promise<void> {
    const errors = await this.validateDto(dtoClass, data);
    expect(errors).toHaveLength(0);
  }

  /**
   * Valida que un DTO tenga errores y retorna los mensajes
   */
  static async expectInvalidDto<T extends object>(
    dtoClass: new () => T,
    data: any,
  ): Promise<string[]> {
    const errors = await this.validateDto(dtoClass, data);
    expect(errors.length).toBeGreaterThan(0);
    return errors.flatMap((error) =>
      error.constraints ? Object.values(error.constraints) : [],
    );
  }

  /**
   * Valida que un campo específico tenga un error
   */
  static async expectFieldError<T extends object>(
    dtoClass: new () => T,
    data: any,
    fieldName: string,
    expectedMessage?: string,
  ): Promise<void> {
    const errors = await this.validateDto(dtoClass, data);
    const fieldError = errors.find((error) => error.property === fieldName);

    expect(fieldError).toBeDefined();

    if (expectedMessage && fieldError) {
      const messages = fieldError.constraints
        ? Object.values(fieldError.constraints)
        : [];
      expect(messages).toContain(expectedMessage);
    }
  }

  /**
   * Obtiene todos los mensajes de error de un campo específico
   */
  static async getFieldErrors<T extends object>(
    dtoClass: new () => T,
    data: any,
    fieldName: string,
  ): Promise<string[]> {
    const errors = await this.validateDto(dtoClass, data);
    const fieldError = errors.find((error) => error.property === fieldName);

    if (!fieldError || !fieldError.constraints) {
      return [];
    }

    return Object.values(fieldError.constraints);
  }
}
