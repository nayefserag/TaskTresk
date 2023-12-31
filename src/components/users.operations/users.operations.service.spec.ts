import { Test, TestingModule } from '@nestjs/testing';
import { UsersOperationsService } from './users.operations.service';

describe('UsersOperationsService', () => {
  let service: UsersOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersOperationsService],
    }).compile();

    service = module.get<UsersOperationsService>(UsersOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
