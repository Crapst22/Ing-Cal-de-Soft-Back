import { Test, TestingModule } from '@nestjs/testing';
import { IProductoRepository } from '../../../producto/domain/interfaces/producto.repository-interface';
import { PoliticaEliminacionLinea } from './politica-eliminacion-linea.service';

describe('PoliticaEliminacionLinea', () => {
  let service: PoliticaEliminacionLinea;
  let productoRepository: { existsProductosActivosByLinea: jest.Mock };

  beforeEach(async () => {
    productoRepository = { existsProductosActivosByLinea: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliticaEliminacionLinea,
        { provide: 'IProductoRepository', useValue: productoRepository },
      ],
    }).compile();

    service = module.get<PoliticaEliminacionLinea>(PoliticaEliminacionLinea);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería retornar true si la Línea tiene productos activos', async () => {
    productoRepository.existsProductosActivosByLinea.mockResolvedValue(true);

    const result = await service.tieneProductosActivosParaLinea(7);

    expect(productoRepository.existsProductosActivosByLinea).toHaveBeenCalledWith(
      7,
    );
    expect(result).toBe(true);
  });

  it('debería retornar false si la Línea no tiene productos activos', async () => {
    productoRepository.existsProductosActivosByLinea.mockResolvedValue(false);

    const result = await service.tieneProductosActivosParaLinea(7);

    expect(result).toBe(false);
  });
});