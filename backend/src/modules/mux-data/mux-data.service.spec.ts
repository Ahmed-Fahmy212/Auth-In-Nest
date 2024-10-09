import { Test, TestingModule } from '@nestjs/testing';
import { MuxDataService } from './mux-data.service';

describe('MuxDataService', () => {
  let service: MuxDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuxDataService],
    }).compile();

    service = module.get<MuxDataService>(MuxDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
