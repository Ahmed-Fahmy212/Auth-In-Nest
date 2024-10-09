import { Module } from '@nestjs/common';
import { MuxDataService } from './mux-data.service';
import { MuxDataController } from './mux-data.controller';

@Module({
  controllers: [MuxDataController],
  providers: [MuxDataService],
})
export class MuxDataModule {}
