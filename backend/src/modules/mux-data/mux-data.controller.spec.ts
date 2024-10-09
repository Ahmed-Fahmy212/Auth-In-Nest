import { Test, TestingModule } from '@nestjs/testing';
import { MuxDataController } from './mux-data.controller';
import { MuxDataService } from './mux-data.service';

describe('MuxDataController', () => {
  let controller: MuxDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuxDataController],
      providers: [MuxDataService],
    }).compile();

    controller = module.get<MuxDataController>(MuxDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
