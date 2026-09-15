# ⚡ Quick Start - Tests de DTOs

## 🎯 En 5 Minutos

### 1. Ejecutar todos los tests de DTOs
```bash
yarn test:dtos
```

### 2. Ver cobertura
```bash
yarn test:dtos:cov
```

### 3. Ejecutar un test específico
```bash
# Por nombre
yarn test login.dto.spec

# Por ruta parcial
yarn test gestion-usuario
```

## 📝 Crear un Nuevo Test

### Paso 1: Crear el archivo
```bash
# Estructura
src/modules/[modulo]/[submodulo]/dto/__tests__/[nombre].dto.spec.ts
```

### Paso 2: Template básico
```typescript
import { MiDto } from '../mi.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('MiDto', () => {
  describe('Validación exitosa', () => {
    it('debería ser válido con datos correctos', async () => {
      const data = {
        campo1: 'valor',
        campo2: 123,
      };
      
      await DtoValidatorHelper.expectValidDto(MiDto, data);
    });
  });

  describe('Validación del campo campo1', () => {
    it('debería fallar si campo1 está vacío', async () => {
      const data = {
        campo1: '',
        campo2: 123,
      };
      
      await DtoValidatorHelper.expectFieldError(
        MiDto,
        data,
        'campo1',
        'El campo1 no puede estar vacío'
      );
    });
  });

  describe('Casos extremos', () => {
    it('debería fallar con objeto vacío', async () => {
      const errors = await DtoValidatorHelper.validateDto(MiDto, {});
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
```

### Paso 3: Ejecutar
```bash
yarn test mi.dto.spec
```

## 🔧 Helper Methods

### Validar DTO (retorna errores)
```typescript
const errors = await DtoValidatorHelper.validateDto(MiDto, data);
```

### Esperar DTO válido
```typescript
await DtoValidatorHelper.expectValidDto(MiDto, data);
```

### Esperar DTO inválido
```typescript
const messages = await DtoValidatorHelper.expectInvalidDto(MiDto, data);
```

### Esperar error en campo
```typescript
await DtoValidatorHelper.expectFieldError(
  MiDto,
  data,
  'nombreCampo',
  'Mensaje esperado' // opcional
);
```

### Obtener errores de un campo
```typescript
const messages = await DtoValidatorHelper.getFieldErrors(
  MiDto,
  data,
  'nombreCampo'
);
```

## 📋 Checklist de Tests

Para cada DTO, testear:

- [ ] ✅ Validación exitosa con todos los campos
- [ ] ✅ Validación exitosa con campos opcionales omitidos
- [ ] ❌ Campos requeridos vacíos
- [ ] ❌ Campos requeridos ausentes
- [ ] ❌ Tipos de datos incorrectos
- [ ] ❌ Formatos inválidos (email, regex, etc.)
- [ ] ⚠️ Valores límite (min, max)
- [ ] ⚠️ Strings muy largos
- [ ] ⚠️ Caracteres especiales
- [ ] ⚠️ Valores null/undefined
- [ ] ⚠️ Objeto vacío {}

## 💡 Ejemplos Rápidos

### Test de campo requerido
```typescript
it('debería fallar si email está vacío', async () => {
  const data = { email: '', password: '12345678' };
  await DtoValidatorHelper.expectFieldError(MiDto, data, 'email');
});
```

### Test de tipo incorrecto
```typescript
it('debería fallar si edad no es número', async () => {
  const data = { edad: 'veinte' };
  await DtoValidatorHelper.expectFieldError(MiDto, data, 'edad');
});
```

### Test de formato de email
```typescript
it('debería fallar con email inválido', async () => {
  const data = { email: 'no-es-email' };
  await DtoValidatorHelper.expectFieldError(
    MiDto, 
    data, 
    'email',
    'El correo electrónico debe ser válido'
  );
});
```

### Test de longitud mínima
```typescript
it('debería fallar con contraseña corta', async () => {
  const data = { password: '123' };
  await DtoValidatorHelper.expectFieldError(
    MiDto,
    data,
    'password',
    'La contraseña debe tener al menos 8 caracteres'
  );
});
```

### Test de transformación
```typescript
it('debería transformar a lowercase', async () => {
  const data = { nombre: 'JUAN' };
  await DtoValidatorHelper.expectValidDto(MiDto, data);
  // La transformación se aplica automáticamente
});
```

## 🎨 Patrones Comunes

### String requerido no vacío
```typescript
@IsString()
@IsNotEmpty()
campo: string;

// Tests: vacío '', ausente, tipo incorrecto, espacios '   '
```

### Email válido
```typescript
@IsEmail()
@IsNotEmpty()
email: string;

// Tests: formato inválido, vacío, ausente
```

### Número entero
```typescript
@IsInt()
@IsNotEmpty()
id: number;

// Tests: decimal, string, ausente, null
```

### Campo opcional
```typescript
@IsOptional()
@IsString()
observacion?: string;

// Tests: presente, ausente, null, tipo incorrecto
```

### Enum
```typescript
@IsEnum(MiEnum)
tipo: MiEnum;

// Tests: valor válido, valor inválido, número incorrecto
```

### Transformación
```typescript
@Transform(({ value }) => value.toLowerCase())
@IsString()
nombre: string;

// Tests: mayúsculas, minúsculas, mixto
```

## 🚨 Errores Comunes

### ❌ No usar await
```typescript
// MAL
DtoValidatorHelper.expectValidDto(MiDto, data);

// BIEN
await DtoValidatorHelper.expectValidDto(MiDto, data);
```

### ❌ No importar correctamente el helper
```typescript
// MAL
import { DtoValidatorHelper } from '../test-helpers/dto-validator.helper';

// BIEN - ajustar niveles según ubicación
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';
```

### ❌ No especificar el tipo genérico
```typescript
// MAL
await DtoValidatorHelper.validateDto(data);

// BIEN
await DtoValidatorHelper.validateDto(MiDto, data);
```

## 📊 Ver Resultados

### Salida de tests
```
PASS  src/modules/common/dto/__tests__/pagination.dto.spec.ts
  PaginationDto
    Validación exitosa
      ✓ debería ser válido con skip y take como números
      ✓ debería ser válido sin skip ni take (opcionales)
    Validación con errores
      ✓ debería fallar si skip no es un número
```

### Reporte de cobertura
```bash
yarn test:dtos:cov

# Ver reporte en coverage/lcov-report/index.html
```

## 🔗 Links Útiles

- [Documentación Completa](TESTS-DTOS-README.md)
- [Resumen de Tests](RESUMEN-TESTS-DTOS.md)
- [Índice de Tests](TESTS-INDEX.md)
- [class-validator docs](https://github.com/typestack/class-validator)
- [Jest docs](https://jestjs.io/)

## 🆘 Ayuda Rápida

### "Mi test no corre"
1. Verifica que el archivo termine en `.spec.ts`
2. Verifica la importación del helper
3. Asegúrate de usar `async/await`

### "Error: cannot find module"
1. Ajusta la ruta relativa del import
2. Verifica que el módulo exista
3. Ejecuta `yarn install` si falta una dependencia

### "El test pasa pero debería fallar"
1. Verifica que uses `await`
2. Revisa los decoradores del DTO
3. Asegúrate de usar el método correcto del helper

### "Quiero ver qué errores retorna"
```typescript
const errors = await DtoValidatorHelper.validateDto(MiDto, data);
console.log(errors);
```

---

**Pro tip**: Empieza copiando un test similar existente y modificalo según tu necesidad.

**Happy Testing! 🎉**
