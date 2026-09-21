import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductoRelatedEntitiesValidator } from './producto-related-entities.validator';
import { MarcaService } from '../../../marca/application/services/marca.service';
import { LineaService } from '../../../linea/application/services/linea.service';
import { PresentacionService } from '../../../presentacion/application/services/presentacion.service';

describe('ProductoRelatedEntitiesValidator', () => {
  let validator: ProductoRelatedEntitiesValidator;

  const marca = { id: 1, denominacion: 'MarcaX' };
  const linea = { id: 2, denominacion: 'LíneaY' };
  const presentacion = { id: 3, tipo: 'volume', volumen: 1, unidad: 'l' };

  const mockMarcaService = { findEntityById: jest.fn() };
  const mockLineaService = { findEntityById: jest.fn() };
  const mockPresentacionService = { findEntityById: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockMarcaService.findEntityById.mockResolvedValue(marca);
    mockLineaService.findEntityById.mockResolvedValue(linea);
    mockPresentacionService.findEntityById.mockResolvedValue(presentacion);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoRelatedEntitiesValidator,
        { provide: MarcaService, useValue: mockMarcaService },
        { provide: LineaService, useValue: mockLineaService },
        { provide: PresentacionService, useValue: mockPresentacionService },
      ],
    }).compile();

    validator = module.get(ProductoRelatedEntitiesValidator);
  });

  it('obtiene marca, línea y presentación', async () => {
    const result = await validator.validarYObtenerEntidadesRelacionadas(1, 2, 3);

    expect(result).toEqual({ marca, linea, presentacion });
  });

  it('no exige presentación cuando llega null', async () => {
    const result = await validator.validarYObtenerEntidadesRelacionadas(1, 2, null);

    expect(mockPresentacionService.findEntityById).not.toHaveBeenCalled();
    expect(result.presentacion).toBeUndefined();
  });

  it('lanza NotFound si la presentación no existe', async () => {
    mockPresentacionService.findEntityById.mockResolvedValue(null);

    await expect(
      validator.validarYObtenerEntidadesRelacionadas(1, 2, 3),
    ).rejects.toThrow(NotFoundException);
  });

  it('lanza NotFound si la marca no existe', async () => {
    mockMarcaService.findEntityById.mockResolvedValue(null);

    await expect(
      validator.validarYObtenerEntidadesRelacionadas(1, 2),
    ).rejects.toThrow(NotFoundException);
  });

  it('lanza NotFound si la línea no existe', async () => {
    mockLineaService.findEntityById.mockResolvedValue(null);

    await expect(
      validator.validarYObtenerEntidadesRelacionadas(1, 2),
    ).rejects.toThrow(NotFoundException);
  });
});