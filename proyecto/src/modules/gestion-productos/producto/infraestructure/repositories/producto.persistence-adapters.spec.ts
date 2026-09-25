import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { DataSource, Repository } from 'typeorm';
import { Producto } from '../../domain/entities/producto.entity';
import { HistorialPrecio, TipoCambioPrecio } from '../../domain/entities/historial-precio.entity';
import { ProductoIntrinsicValidationService } from '../../domain/services/producto-intrinsic-validation.service';
import { ProductoPersistenceAdapter } from './producto.persistence-adapters';

describe('ProductoPersistenceAdapter - CR-007 historial', () => {
  const usuario = { id: 4 } as any;
  let adapter: ProductoPersistenceAdapter;
  let runner: any;
  let productoRepo: any;
  let historialRepo: any;

  beforeEach(() => {
    productoRepo = {
      save: jest.fn(async (producto) => producto),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    historialRepo = { save: jest.fn(async (historial) => historial) };
    runner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        getRepository: (entity: unknown) => entity === HistorialPrecio ? historialRepo : productoRepo,
      },
    };
    const dataSource = { createQueryRunner: () => runner } as unknown as DataSource;
    adapter = new ProductoPersistenceAdapter(
      {} as Repository<Producto>,
      dataSource,
      {} as any,
      new ProductoIntrinsicValidationService(),
    );
  });

  it('guarda cambio individual e historial juntos con motivo sin alterarlo', async () => {
    const producto = { id: 2, precio: 100, deletedAt: null } as unknown as Producto;
    const qb: any = {};
    qb.leftJoinAndSelect = qb.where = qb.andWhere = qb.setLock = () => qb;
    qb.getOne = async () => producto;
    productoRepo.createQueryBuilder.mockReturnValue(qb);

    await adapter.update(2, { precio: 120 } as any, {} as any, {} as any, usuario, null, 'Costo proveedor');

    expect(productoRepo.save).toHaveBeenCalledWith(expect.objectContaining({ precio: 120 }));
    expect(historialRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      precioAnterior: 100,
      precioNuevo: 120,
      motivo: 'Costo proveedor',
      tipoCambio: TipoCambioPrecio.INDIVIDUAL,
    }));
    expect(runner.commitTransaction).toHaveBeenCalled();
  });

  it('no registra historial si el precio no cambia', async () => {
    const producto = { id: 2, precio: 100, deletedAt: null } as unknown as Producto;
    const qb: any = {};
    qb.leftJoinAndSelect = qb.where = qb.andWhere = qb.setLock = () => qb;
    qb.getOne = async () => producto;
    productoRepo.createQueryBuilder.mockReturnValue(qb);

    await adapter.update(2, { precio: 100 } as any, {} as any, {} as any, usuario, null, undefined);

    expect(historialRepo.save).not.toHaveBeenCalled();
  });

  it('rechaza precio individual no positivo y revierte la transacción', async () => {
  const producto = { id: 2, precio: 100, deletedAt: null } as unknown as Producto;
  const qb: any = {};
  qb.leftJoinAndSelect = qb.where = qb.andWhere = qb.setLock = () => qb;
  qb.getOne = async () => producto;
  productoRepo.createQueryBuilder.mockReturnValue(qb);

  // Caso precio = 0
  await expect(
    adapter.update(
      2,
      { precio: 0 } as any,
      {} as any,
      {} as any,
      usuario,
      null,
      'Error'
    )
  ).rejects.toBeInstanceOf(BadRequestException);

  expect(productoRepo.save).not.toHaveBeenCalled();
  expect(runner.rollbackTransaction).toHaveBeenCalled();

  // Caso precio negativo
  await expect(
    adapter.update(
      2,
      { precio: -10 } as any,
      {} as any,
      {} as any,
      usuario,
      null,
      'Error'
    )
  ).rejects.toBeInstanceOf(BadRequestException);

  expect(productoRepo.save).not.toHaveBeenCalled();
  expect(runner.rollbackTransaction).toHaveBeenCalled();
});

  it('registra solo precios realmente modificados por ajuste masivo', async () => {
    const beforeBuilder: any = {};
    beforeBuilder.select = beforeBuilder.where = beforeBuilder.andWhere = beforeBuilder.setLock = () => beforeBuilder;
    beforeBuilder.getMany = async () => [{ id: 1, precio: 100 }, { id: 2, precio: 50 }];
    const updateBuilder: any = {};
    updateBuilder.update = updateBuilder.set = updateBuilder.setParameters = updateBuilder.where = updateBuilder.andWhere = () => updateBuilder;
    updateBuilder.execute = async () => ({ affected: 2 });
    productoRepo.createQueryBuilder.mockReturnValueOnce(beforeBuilder).mockReturnValueOnce(updateBuilder);
    productoRepo.find.mockResolvedValue([{ id: 1, precio: 110 }, { id: 2, precio: 50 }]);

    const affected = await adapter.actualizarPreciosMasivo(2 as any, 10, usuario, undefined, 'Cambio de lista');

    expect(affected).toBe(2);
    expect(historialRepo.save).toHaveBeenCalledTimes(1);
    expect(historialRepo.save.mock.calls[0][0]).toEqual([expect.objectContaining({
      productoId: 1,
      precioAnterior: 100,
      precioNuevo: 110,
      motivo: 'Cambio de lista',
      tipoCambio: TipoCambioPrecio.MASIVO,
    })]);
  });

  it('revierte el ajuste masivo si un precio resultante no es positivo', async () => {
    const beforeBuilder: any = {};
    beforeBuilder.select = beforeBuilder.where = beforeBuilder.andWhere = beforeBuilder.setLock = () => beforeBuilder;
    beforeBuilder.getMany = async () => [{ id: 1, precio: -5 }];
    const updateBuilder: any = {};
    updateBuilder.update = updateBuilder.set = updateBuilder.setParameters = updateBuilder.where = updateBuilder.andWhere = () => updateBuilder;
    updateBuilder.execute = async () => ({ affected: 1 });
    productoRepo.createQueryBuilder.mockReturnValueOnce(beforeBuilder).mockReturnValueOnce(updateBuilder);
    productoRepo.find.mockResolvedValue([{ id: 1, precio: -4 }]);

    await expect(adapter.actualizarPreciosMasivo(2 as any, 1, usuario, undefined, 'Ajuste'))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(historialRepo.save).not.toHaveBeenCalled();
    expect(runner.rollbackTransaction).toHaveBeenCalled();
  });
});
