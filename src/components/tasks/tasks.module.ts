import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/Schema/task.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { UserSchema } from 'src/Schema/users.schema';
import { UsersOperationsService } from '../users.operations/users.operations.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    
  ],
  controllers: [TasksController],
  providers: [TasksService,JwtAuthGuard,UsersOperationsService],
})
export class TasksModule {}
