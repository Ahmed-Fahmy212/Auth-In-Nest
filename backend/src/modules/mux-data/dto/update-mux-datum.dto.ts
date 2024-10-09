import { PartialType } from '@nestjs/mapped-types';
import { CreateMuxDatumDto } from './create-mux-datum.dto';

export class UpdateMuxDatumDto extends PartialType(CreateMuxDatumDto) {}
