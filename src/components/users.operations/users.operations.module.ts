import { Module } from '@nestjs/common';
import { UsersOperationsController } from './users.operations.controller';
import { UsersOperationsService } from './users.operations.service';

@Module({
  controllers: [UsersOperationsController],
  providers: [UsersOperationsService]
})
export class UsersOperationsModule {}
