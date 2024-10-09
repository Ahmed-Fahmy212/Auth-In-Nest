import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MuxDataService } from './mux-data.service';
import { CreateMuxDatumDto } from './dto/create-mux-datum.dto';
import { UpdateMuxDatumDto } from './dto/update-mux-datum.dto';

@Controller('mux-data')
export class MuxDataController {
  constructor(private readonly muxDataService: MuxDataService) {}

  @Post()
  create(@Body() createMuxDatumDto: CreateMuxDatumDto) {
    return this.muxDataService.create(createMuxDatumDto);
  }

  @Get()
  findAll() {
    return this.muxDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.muxDataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMuxDatumDto: UpdateMuxDatumDto) {
    return this.muxDataService.update(+id, updateMuxDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.muxDataService.remove(+id);
  }
}
