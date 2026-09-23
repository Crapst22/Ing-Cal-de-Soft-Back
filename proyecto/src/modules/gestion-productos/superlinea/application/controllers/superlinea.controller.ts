import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  ParseIntPipe,
  Put,
  Query,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { AuditoriaDto } from 'src/modules/gestion-sistema/auditoria/dto/auditoria.dto';
import { SuperLineaService } from '../services/superlinea.service';
import { CreateSuperLineaDto } from '../../dto/create-superlinea.dto';
import { SuperLineaDto } from '../../dto/superlinea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-superlinea.dto';

@ApiTags('Gestion Productos')
@Controller('superlinea')
@UseGuards(AuthGuard)
export class SuperLineaController {
  private readonly logger = new Logger(SuperLineaController.name);
  constructor(private readonly service: SuperLineaService) {}

  private readonly ENTITY_NAME = 'SuperLinea';

  @Post()
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  create(@Body() createDto: CreateSuperLineaDto) {
    this.logger.log(`Creando un nuevo ${this.ENTITY_NAME}...`);
    return this.service.create(createDto);
  }

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionSearchPipe)
  findByDenominacionFiltered(
    @Query() paginationDto: PaginationWithDenominacionDto,
  ) {
    const { denominacion = '', skip, take, incluirEliminados } = paginationDto;
    this.logger.log(
      `Buscando ${this.ENTITY_NAME} con denominación: ${denominacion}`,
    );
    return this.service.findByDenominacionFiltered(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: SuperLineaDto })
  @Roles('Root', 'Administrador', 'Empleado')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SuperLineaDto> {
    this.logger.log(`Buscando ${this.ENTITY_NAME} con ID: ${id}`);
    return this.service.findDtoById(+id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSuperLineaDto,
  ) {
    this.logger.log(`Actualizando ${this.ENTITY_NAME} con ID: ${id}`);
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
  findByIdConAuditoria(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditoriaDto> {
    return this.service.findByIdConAuditoria(id);
  }

  @Get(':id/lineas')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({
    description: 'Lineas asociadas a la super linea',
    type: [SuperLineaDto],
  })
  findLineasPorSuperLinea(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn(`Buscando lineas de super linea con ID: ${id}`);
    return this.service.findLineasPorSuperLinea(id);
  }
}