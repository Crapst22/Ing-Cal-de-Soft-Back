import { Test, TestingModule } from '@nestjs/testing';
import { ILineaRepository } from '../../../linea/domain/interfaces/linea.repository.interface';
import { PoliticaEliminacionSuperLinea } from './politica-eliminacion-superlinea.service';

describe('PoliticaEliminacionSuperLinea', () => {
  let service: PoliticaEliminacionSuperLinea;
  let lineaRepository: { existsLineasActivasBySuperLinea: jest.Mock };

  beforeEach(async () => {
    lineaRepository = { existsLineasActivasBySuperLinea: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliticaEliminacionSuperLinea,
        { provide: 'ILineaRepository', useValue: lineaRepository },
      ],
    }).compile();

    service = module.get<PoliticaEliminacionSuperLinea>(
      PoliticaEliminacionSuperLinea,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería retornar true si la SuperLínea tiene líneas activas', async () => {
    lineaRepository.existsLineasActivasBySuperLinea.mockResolvedValue(true);

    const result = await service.tieneLineasActivasParaSuperLinea(7);

    expect(lineaRepository.existsLineasActivasBySuperLinea).toHaveBeenCalledWith(
      7,
    );
    expect(result).toBe(true);
  });

  it('debería retornar false si la SuperLínea no tiene líneas activas', async () => {
    lineaRepository.existsLineasActivasBySuperLinea.mockResolvedValue(false);

    const result = await service.tieneLineasActivasParaSuperLinea(7);

    expect(result).toBe(false);
  });
});