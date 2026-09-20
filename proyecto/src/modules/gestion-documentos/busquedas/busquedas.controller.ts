import { Controller, Get,  Query, InternalServerErrorException } from '@nestjs/common';
import { BusquedasService } from './busquedas.service';

import { SearchBusquedaGenericoDto } from './dto/search-busqueda-generico.dto';

@Controller('busquedas-genericas')
export class BusquedasController {
  constructor(private readonly service: BusquedasService) {}


  @Get('search-by')
  async findBy(@Query() paginationDto: SearchBusquedaGenericoDto) {

    const {
      fechaDesde,
      fechaHasta,
      empresaId,
      operadorId,
      tipoDocumento,
      skip,
      take,
    } = paginationDto;

    

    return await this.service.findByFiltered(
      tipoDocumento,
      fechaDesde,
      fechaHasta,
      empresaId,
      operadorId,
      skip,
      take,
    );
 
  }
  


}
