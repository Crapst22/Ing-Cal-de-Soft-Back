import { PresentacionDto } from '../presentacion.dto';
import { DtoValidatorHelper } from '../../../../common/test-helpers/dto-validator.helper';

describe('PresentacionDto', () => {
  it('acepta un DTO válido de tipo pack', async () => {
    await DtoValidatorHelper.expectValidDto(PresentacionDto, {
      id: 1,
      tipo: 'pack',
      quantity: 6,
      volumen: 500,
      unidad: 'ml',
      denominacion: 'Pack x6 de 500ml',
      sistema: 0,
      deletedAt: null,
    });
  });

  it('acepta un DTO válido de tipo volumen con nulos', async () => {
    await DtoValidatorHelper.expectValidDto(PresentacionDto, {
      id: 2,
      tipo: 'volume',
      quantity: null,
      volumen: 1,
      unidad: 'l',
      denominacion: '1l',
      sistema: 1,
      deletedAt: null,
    });
  });

  it('falla cuando faltan los campos obligatorios', async () => {
    const errors = await DtoValidatorHelper.validateDto(PresentacionDto, {});

    expect(errors.length).toBeGreaterThan(0);
    const props = errors.map((error) => error.property);
    expect(props).toEqual(
      expect.arrayContaining(['id', 'tipo', 'denominacion', 'sistema']),
    );
  });
});