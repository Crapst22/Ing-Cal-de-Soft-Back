import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDto } from './create-presentacion.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateMarcaDto extends PartialType(CreateMarcaDto) {

    updatedAt: Date;

    @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
    @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
    usuarioUpdatedId: number;

}
