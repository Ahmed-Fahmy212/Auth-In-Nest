import { Injectable } from '@nestjs/common';
import { CreateMuxDatumDto } from './dto/create-mux-datum.dto';
import { UpdateMuxDatumDto } from './dto/update-mux-datum.dto';

@Injectable()
export class MuxDataService {
  create(createMuxDatumDto: CreateMuxDatumDto) {
    return 'This action adds a new muxDatum';
  }

  findAll() {
    return `This action returns all muxData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} muxDatum`;
  }

  update(id: number, updateMuxDatumDto: UpdateMuxDatumDto) {
    return `This action updates a #${id} muxDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} muxDatum`;
  }
}
