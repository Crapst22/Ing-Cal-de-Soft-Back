# 📦 Comandos de Yarn

## ℹ️ Información del Proyecto

Este proyecto utiliza **Yarn** como gestor de paquetes.

## 📦 Comandos principales

| Tarea | Comando |
|-------|---------|
| Instalar dependencias | `yarn` o `yarn install` |
| Agregar paquete | `yarn add <paquete>` |
| Agregar dependencia de desarrollo | `yarn add -D <paquete>` |
| Remover paquete | `yarn remove <paquete>` |
| Actualizar paquetes | `yarn upgrade` |
| Ejecutar script | `yarn <script>` |
| Ejecutar tests | `yarn test` |
| Ver versión | `yarn --version` |

## 🎯 Comandos de Tests para Este Proyecto

### ✅ Comandos disponibles

```bash
# Todos los tests
yarn test

# Tests de DTOs
yarn test:dtos

# Con cobertura
yarn test:cov
yarn test:dtos:cov

# Watch mode
yarn test:watch

# Test específico
yarn test login.dto.spec

# Debugger
yarn test:debug
```

## 🛠️ Scripts disponibles

