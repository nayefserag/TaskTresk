import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/Schema/task.schema';


@Module({
  imports: [ MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
