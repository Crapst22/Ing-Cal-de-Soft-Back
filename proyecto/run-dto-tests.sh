#!/bin/bash

echo "================================"
echo "Ejecutando Tests de DTOs"
echo "================================"
echo ""

# Test de PaginationDto
echo "📋 Testing PaginationDto..."
yarn test --testPathPattern="pagination.dto.spec" --passWithNoTests

echo ""
echo "📧 Testing LoginDto..."
yarn test --testPathPattern="login.dto.spec" --passWithNoTests

echo ""
echo "👤 Testing RegistrarUsuarioDto..."
yarn test --testPathPattern="register.dto.spec" --passWithNoTests

echo ""
echo "👥 Testing CreateUsuarioDto..."
yarn test --testPathPattern="create-usuario.dto.spec" --passWithNoTests

echo ""
echo "🏢 Testing CreateClienteDto..."
yarn test --testPathPattern="create-cliente.dto.spec" --passWithNoTests

echo ""
echo "📦 Testing CreateProductoDto..."
yarn test --testPathPattern="create-producto.dto.spec" --passWithNoTests

echo ""
echo "🏠 Testing CreateDomicilioDto..."
yarn test --testPathPattern="create-domicilio.dto.spec" --passWithNoTests

echo ""
echo "================================"
echo "Tests Completados"
echo "================================"
