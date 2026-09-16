import { Test, TestingModule } from '@nestjs/testing';
import { LineaService } from './linea.service';
import { PoliticaEliminacionLinea } from '../../domain/services/politica-eliminacion-linea.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { SuperLineaService } from '../../../superlinea/application/services/superlinea.service';

describe('LineaService', () => {
  let service: LineaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineaService,
        {
          provide: 'ILineaRepository',
          useValue: {},
        },
        {
          provide: PoliticaEliminacionLinea,
          useValue: { tieneProductosActivosParaLinea: jest.fn() },
        },
        {
          provide: UsuarioService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: SuperLineaService,
          useValue: { findDtoById: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<LineaService>(LineaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});