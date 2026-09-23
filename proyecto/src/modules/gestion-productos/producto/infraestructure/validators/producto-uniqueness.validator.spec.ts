import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { ProductoUniquenessValidator } from './producto-uniqueness.validator';

describe('ProductoUniquenessValidator', () => {
  let validator: ProductoUniquenessValidator;
  const mockRepository = {
    existsByDenominacion: jest.fn(),
    existsByCodigoProveedor: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoUniquenessValidator,
        { provide: 'IProductoRepository', useValue: mockRepository },
      ],
    }).compile();

    validator = module.get(ProductoUniquenessValidator);
  });

  it('aprueba denominaciones que no existen', async () => {
    mockRepository.existsByDenominacion.mockResolvedValue(false);

    await expect(
      validator.validarDenominacionUnica('aceite'),
    ).resolves.not.toThrow();
    expect(mockRepository.existsByDenominacion).toHaveBeenCalledWith(
      'aceite',
      undefined,
    );
  });

  it('rechaza denominaciones duplicadas', async () => {
    mockRepository.existsByDenominacion.mockResolvedValue(true);

    await expect(
      validator.validarDenominacionUnica('aceite'),
    ).rejects.toThrow(ConflictException);
  });

  it('aprueba códigos de proveedor que no existen', async () => {
    mockRepository.existsByCodigoProveedor.mockResolvedValue(false);

    await expect(
      validator.validarCodigoProveedorUnico('PROV-1', 1),
    ).resolves.not.toThrow();
    expect(mockRepository.existsByCodigoProveedor).toHaveBeenCalledWith(
      'PROV-1',
      1,
    );
  });

  it('rechaza códigos de proveedor duplicados', async () => {
    mockRepository.existsByCodigoProveedor.mockResolvedValue(true);

    await expect(
      validator.validarCodigoProveedorUnico('PROV-1', 0),
    ).rejects.toThrow(ConflictException);
  });
});