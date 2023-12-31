import { Test, TestingModule } from '@nestjs/testing';
import { UsersOperationsController } from './users.operations.controller';

describe('UsersOperationsController', () => {
  let controller: UsersOperationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersOperationsController],
    }).compile();

    controller = module.get<UsersOperationsController>(UsersOperationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
