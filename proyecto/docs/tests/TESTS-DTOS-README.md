# Tests Exhaustivos de DTOs

Este documento describe la suite de tests exhaustivos creada para validar todos los DTOs del proyecto.

## 📋 Estructura de Tests

Los tests están organizados siguiendo la misma estructura de módulos del proyecto:

```
src/
├── modules/
│   ├── common/
│   │   ├── dto/
│   │   │   ├── __tests__/
│   │   │   │   ├── pagination.dto.spec.ts
│   │   │   │   └── denominacion.dto.spec.ts
│   │   │   └── busquedas/
│   │   │       └── __tests__/
│   │   │           └── pagination-with-denominacion.dto.spec.ts
│   │   └── test-helpers/
│   │       └── dto-validator.helper.ts
│   ├── gestion-usuario/
│   │   ├── auth/dto/__tests__/
│   │   │   ├── login.dto.spec.ts
│   │   │   └── register.dto.spec.ts
│   │   └── usuario/dto/__tests__/
│   │       └── create-usuario.dto.spec.ts
│   ├── organizacion/
│   │   └── cliente/dto/__tests__/
│   │       └── create-cliente.dto.spec.ts
│   ├── gestion-productos/
│   │   └── producto/dto/__tests__/
│   │       └── create-producto.dto.spec.ts
│   └── gutil/
│       └── domicilio/dto/__tests__/
│           └── create-domicilio.dto.spec.ts
```

## 🛠️ Helper de Validación

Se ha creado un helper `DtoValidatorHelper` que proporciona métodos útiles para validar DTOs:

### Métodos disponibles:

- **`validateDto<T>(dtoClass, data)`**: Valida un DTO y retorna los errores
- **`expectValidDto<T>(dtoClass, data)`**: Espera que un DTO sea válido (sin errores)
- **`expectInvalidDto<T>(dtoClass, data)`**: Espera que un DTO tenga errores
- **`expectFieldError<T>(dtoClass, data, fieldName, expectedMessage?)`**: Valida que un campo específico tenga error
- **`getFieldErrors<T>(dtoClass, data, fieldName)`**: Obtiene todos los mensajes de error de un campo

## 🧪 Cobertura de Tests

### DTOs Testeados

#### 1. **Common DTOs**
- ✅ `PaginationDto` - Paginación básica
- ✅ `DenominacionDto` - Filtro por denominación
- ✅ `PaginationWithDenominacionDto` - Paginación con búsqueda

#### 2. **Autenticación y Usuarios**
- ✅ `LoginDto` - Login de usuarios
- ✅ `RegistrarUsuarioDto` - Registro de usuarios
- ✅ `CreateUsuarioDto` - Creación de usuarios

#### 3. **Organización**
- ✅ `CreateClienteDto` - Creación de clientes (DTO complejo con subdocumentos)

#### 4. **Productos**
- ✅ `CreateProductoDto` - Creación de productos (con enums y transformaciones)

#### 5. **Utilidades**
- ✅ `CreateDomicilioDto` - Creación de domicilios

### Tipos de Validaciones Testeadas

Cada DTO incluye tests para:

1. **Validaciones exitosas** ✅
   - Todos los campos correctos
   - Campos opcionales presentes/ausentes
   - Diferentes formatos válidos
   - Transformaciones de datos

2. **Validaciones con errores** ❌
   - Campos vacíos
   - Campos ausentes
   - Tipos de datos incorrectos
   - Valores fuera de rango
   - Formatos inválidos

3. **Casos extremos** ⚠️
   - Valores límite (min/max)
   - Strings muy largos
   - Números negativos/muy grandes
   - Caracteres especiales
   - Caracteres Unicode
   - Valores null/undefined
   - Arrays y objetos donde no corresponden

## 🚀 Ejecutar Tests

### Ejecutar todos los tests
```bash
yarn test
```

### Ejecutar tests con cobertura
```bash
yarn test:cov
```

### Ejecutar tests en modo watch
```bash
yarn test:watch
```

### Ejecutar tests de DTOs específicos

```bash
# Tests de paginación
yarn test pagination.dto.spec

# Tests de login
yarn test login.dto.spec

# Tests de cliente
yarn test create-cliente.dto.spec

# Tests de producto
yarn test create-producto.dto.spec
```

### Ejecutar tests de un módulo completo

```bash
# Tests del módulo común
yarn test src/modules/common

# Tests de gestión de usuarios
yarn test src/modules/gestion-usuario

# Tests de productos
yarn test src/modules/gestion-productos
```

## 📊 Estadísticas de Cobertura

Los tests cubren:

- ✅ Validaciones de `class-validator`
- ✅ Transformaciones de `class-transformer`
- ✅ Decoradores `@IsString`, `@IsNumber`, `@IsEmail`, etc.
- ✅ Decoradores `@IsOptional`, `@IsNotEmpty`
- ✅ Validaciones de longitud `@MaxLength`, `@MinLength`
- ✅ Validaciones de rango `@Min`, `@Max`
- ✅ Validaciones de tipo `@IsInt`, `@IsBoolean`
- ✅ Validaciones de formato `@IsEmail`, `@Matches`
- ✅ Validaciones de enum `@IsEnum`
- ✅ Transformaciones `@Transform`, `@Type`

## 🔍 Ejemplos de Tests

### Ejemplo 1: Test básico de validación exitosa

```typescript
it('debería ser válido con todos los campos correctos', async () => {
  const data = {
    denominacion: 'Usuario Test',
    mail: 'test@example.com',
    contrasena: 'password123',
    rolId: 1,
  };

  await DtoValidatorHelper.expectValidDto(CreateUsuarioDto, data);
});
```

### Ejemplo 2: Test de campo requerido

```typescript
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
```

### Ejemplo 3: Test de transformación

```typescript
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
```

## 📝 DTOs Pendientes de Testear

Para completar la cobertura al 100%, faltan testear los siguientes DTOs:

### Gestión de Sistema
- [ ] `ConfiguracionSistemaDto`
- [ ] `AuditoriaDto`

### Organización
- [ ] `CreateEmpresaDto`
- [ ] `CreateProveedorDto`
- [ ] `CreatePersonalDto`
- [ ] Operación DTOs (cliente-operacion, proveedor-operacion, empresa-operacion)

### Productos
- [ ] `CreateMarcaDto`
- [ ] `CreateLineaDto`
- [ ] `ProductoOperacionDto`
- [ ] `UpdateProductoDto`
- [ ] `UpdatePrecioDto`

### Utilidades (gutil)
- [ ] `CreateLocalidadDto`
- [ ] `CreateProvinciaDto`
- [ ] `CreateCondicionIvaDto`
- [ ] `CreateAlicuotaIvaDto`

### Gestión de Documentos
- [ ] `CreateBusquedaDto`
- [ ] `OperadorDto`
- [ ] DTOs de búsqueda

### Common
- [ ] DTOs de búsqueda adicionales
- [ ] DTOs de estado y referencias
- [ ] DTOs de files

## 🎯 Mejores Prácticas

1. **Organización**: Cada DTO tiene su archivo de test en una carpeta `__tests__` junto al DTO
2. **Nomenclatura**: Los archivos de test siguen el patrón `*.spec.ts`
3. **Estructura**: Los tests se agrupan usando `describe` por tipo de validación
4. **Claridad**: Cada test tiene un nombre descriptivo que explica qué valida
5. **Cobertura**: Se prueban casos exitosos, errores y casos extremos
6. **Reutilización**: Se usa el helper para evitar código repetitivo

## 🐛 Debugging Tests

Para debuggear un test específico:

```bash
npm run test:debug -- create-usuario.dto.spec
```

Luego abre Chrome y navega a `chrome://inspect` para conectar el debugger.

## 📈 Próximos Pasos

1. Completar tests para todos los DTOs restantes
2. Agregar tests de integración para validaciones complejas
3. Implementar tests de rendimiento para validaciones masivas
4. Documentar casos especiales y edge cases descubiertos
5. Configurar CI/CD para ejecutar tests automáticamente

## 🤝 Contribuir

Para agregar tests a un nuevo DTO:

1. Crear carpeta `__tests__` junto al DTO
2. Crear archivo `nombre-dto.spec.ts`
3. Importar el helper de validación
4. Seguir la estructura de los tests existentes
5. Incluir al menos: validaciones exitosas, errores, y casos extremos

---

**Fecha de creación**: 2026-09-14
**Última actualización**: 2026-09-14
**Autor**: Sistema de tests automatizados
