import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Query,
  Put,
  ParseIntPipe,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreatePresentacionDto } from '../../dto/create-presentacion.dto';
import { UpdatePresentacionDto } from '../../dto/update-presentacion.dto';
import { PresentacionDto } from '../../dto/presentacion.dto';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { DenominacionBusquedaDto } from 'src/modules/common/dto/denominacion-busqueda.dto';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { PresentacionService } from '../services/presentacion.service';

@ApiTags('Gestion Productos')
@Controller('presentacion')
@UseGuards(AuthGuard)
export class PresentacionController {
  private readonly logger = new Logger(PresentacionController.name);
  constructor(private readonly service: PresentacionService) {}

  private readonly ENTITY_NAME = 'Presentación';

  @Post()
  @Roles('Root', 'Administrador', 'Empleado')
  create(@Body() createDto: CreatePresentacionDto) {
    this.logger.log(`Creando un nueva ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get('find-all-for-presentaciones/select')
  @Roles(
    'Root',
    'Administrador',
    'Empleado',
    'Repartidor',
    'Repositor',
    'Vendedor',
  )
  @UsePipes(NormalizeDenominacionSearchPipe)
  async findAllPresentacionesFor(@Query() dto: DenominacionBusquedaDto) {
    const { denominacion = '' } = dto;
    return this.service.findAllFor(denominacion);
  }

  @Get('search-by')
  @Roles(
    'Root',
    'Administrador',
    'Empleado',
    'Vendedor',
    'Repartidor',
    'Repositor',
  )
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(
    @Query() paginationDto: PaginationWithDenominacionDto,
  ) {
    const { denominacion = '', skip, take, incluirEliminados } = paginationDto;
    this.logger.log(
      `Buscando ${this.ENTITY_NAME} con denominación: ${denominacion}`,
    );
    return this.service.findBy(denominacion, skip, take, incluirEliminados);
  }

  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({ type: PresentacionDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PresentacionDto> {
    this.logger.log(`Buscando ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findDtoById(id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePresentacionDto,
  ) {
    this.logger.log(`Actualizando  ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    this.logger.warn(
      `Eliminando ${this.ENTITY_NAME} con ID: ${id} por usuario: ${usuarioId}`,
    );
    return this.service.remove(id, usuarioId);
  }

  @Get(':id/audit')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({
    description: 'Informacion de auditoria',
    type: AuditoriaDto,
  })
  async findByIdConAuditoria(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditoriaDto> {
    const data = await this.service.findByIdConAuditoria(id);
    return data;
  }
}