import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TaskDto, UpdateTaskDto } from 'src/DTOs/task.dto';
import { UserDto } from 'src/DTOs/user.dto';
import { UsersOperationsService } from '../users.operations/users.operations.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('user') private userModel: Model<UserDto>,
    @InjectModel('Task') private taskModel: Model<TaskDto>,
    private userOperations: UsersOperationsService,
  ) {}

  async createTask(body: TaskDto): Promise<TaskDto> {
    const user = await this.userOperations.getuser(null, body.author);
    const newTask = await this.taskModel.create(body);
    user.tasks.push(newTask);
    await user.save();
    return newTask;
  }
  async getTasks(): Promise<TaskDto[]> {
    const tasks = await this.taskModel.find({}, { _id: 0, __v: 0 });
    return tasks;
  }

  async getTask(id: string): Promise<TaskDto | Error> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Task ID');
    }
    const task = await this.taskModel.findById(id, { _id: 0, __v: 0 });
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }
    return task;
  }
  async getTaskByTitle(titleFragment: string): Promise<TaskDto[]> {
    const regex = new RegExp(titleFragment, 'i');
    const tasks = await this.taskModel.find(
      { title: { $regex: regex } },
      { _id: 0, __v: 0 },
    );
    return tasks;
  }

  async updateTask(
    id: string,
    body: UpdateTaskDto,
  ): Promise<UpdateTaskDto | Error> {
    const task = await this.getTask(id);
    await this.taskModel.findByIdAndUpdate(id, body, { new: true });
    
    return task;
  }

  async deleteTask(id: string): Promise<TaskDto | Error | Object> {
    const task = await this.getTask(id);
    await this.taskModel.findByIdAndDelete(id);
    return task;
  }
}
