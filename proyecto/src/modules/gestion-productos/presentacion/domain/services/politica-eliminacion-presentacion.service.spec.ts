import { Test, TestingModule } from '@nestjs/testing';
import { PoliticaEliminacionPresentacion } from './politica-eliminacion-presentacion.service';

describe('PoliticaEliminacionPresentacion', () => {
  let service: PoliticaEliminacionPresentacion;
  let productoRepository: { existsProductosActivosByPresentacion: jest.Mock };

  beforeEach(async () => {
    productoRepository = {
      existsProductosActivosByPresentacion: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliticaEliminacionPresentacion,
        { provide: 'IProductoRepository', useValue: productoRepository },
      ],
    }).compile();

    service = module.get<PoliticaEliminacionPresentacion>(
      PoliticaEliminacionPresentacion,
    );
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('devuelve true cuando la presentación tiene productos activos', async () => {
    productoRepository.existsProductosActivosByPresentacion.mockResolvedValue(true);

    const resultado = await service.tieneProductosActivosParaPresentacion(1);

    expect(
      productoRepository.existsProductosActivosByPresentacion,
    ).toHaveBeenCalledWith(1);
    expect(resultado).toBe(true);
  });

  it('devuelve false cuando no tiene productos activos', async () => {
    productoRepository.existsProductosActivosByPresentacion.mockResolvedValue(false);

    const resultado = await service.tieneProductosActivosParaPresentacion(99);

    expect(
      productoRepository.existsProductosActivosByPresentacion,
    ).toHaveBeenCalledWith(99);
    expect(resultado).toBe(false);
  });
});