import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDomicilioDto } from './dto/update-domicilio.dto';
import { DomicilioDto } from './dto/domicilio.dto';
import { Localidad } from '../localidad/domain/entities/localidad.entity';
import { Domicilio } from './entities/domicilio.entity';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';

@Injectable()
export class DomicilioService {
  private readonly logger = new Logger(DomicilioService.name);

  constructor(
    @InjectRepository(Domicilio)
    private readonly domicilioRepo: Repository<Domicilio>,
    @InjectRepository(Localidad)
    private readonly localidadRepo: Repository<Localidad>,
  ) {}

  async create(
    uow: IUnitOfWork,
    ciudad: Localidad,
    direccion: string,
    usuarioCreatedId: number,
  ): Promise<Domicilio> {
    const repo = uow.getRepository(Domicilio);

    const domicilio = repo.create({
      direccion: direccion,
      localidad: ciudad,
      usuarioCreatedId: usuarioCreatedId,
    });

    return repo.save(domicilio);
  }

  async findAll(): Promise<DomicilioDto[]> {
    const domicilios = await this.domicilioRepo.find({
      relations: ['localidad', 'localidad.provincia'],
    });
    return domicilios.map((d) => this.toDto(d));
  }

  async findOne(id: number): Promise<DomicilioDto> {
    const domicilio = await this.findEntityOrFail(id);
    return this.toDto(domicilio);
  }

  async update(id: number, updateDomicilioDto: UpdateDomicilioDto): Promise<DomicilioDto> {
    const domicilio = await this.findEntityOrFail(id);

    if (updateDomicilioDto.direccion !== undefined) {
      domicilio.direccion = updateDomicilioDto.direccion;
    }

    if (updateDomicilioDto.localidadId !== undefined) {
      const localidad = await this.localidadRepo.findOne({
        where: { id: updateDomicilioDto.localidadId },
        relations: ['provincia'],
      });
      if (!localidad) {
        throw new NotFoundException(`No existe localidad #${updateDomicilioDto.localidadId}`);
      }
      domicilio.localidad = localidad;
    }

    const domicilioActualizado = await this.domicilioRepo.save(domicilio);
    return this.toDto(domicilioActualizado);
  }

  async remove(id: number): Promise<void> {
    const domicilio = await this.findEntityOrFail(id);
    await this.domicilioRepo.remove(domicilio);
  }

  // --- Helpers privados ---

  private async findEntityOrFail(id: number): Promise<Domicilio> {
    const domicilio = await this.domicilioRepo.findOne({
      where: { id },
      relations: ['localidad', 'localidad.provincia'],
    });
    if (!domicilio) {
      throw new NotFoundException(`No existe domicilio #${id}`);
    }
    return domicilio;
  }

  private toDto(domicilio: Domicilio): DomicilioDto {
    const localidad = domicilio.localidad;
    const provincia = localidad?.provincia;

    return {
      id: domicilio.id,
      direccion: domicilio.direccion ?? '',
      localidadId: localidad?.id ?? 0,
      localidad: localidad?.denominacion ?? '',
      provinciaId: provincia?.id ?? 0,
      provincia: provincia?.denominacion ?? '',
    };
  }
}