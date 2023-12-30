import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TaskDto, UpdateTaskDto } from 'src/DTOs/task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private taskModel: Model<TaskDto>) {}

  async createTask(body: TaskDto): Promise<TaskDto> {
    const newTask = await this.taskModel.create(body);
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

  async updateTask( id: string, body: UpdateTaskDto): Promise<UpdateTaskDto | Error> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Task ID');
    }
    const task = await this.taskModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return task;
  }

  async deleteTask(id: string): Promise<TaskDto | Error | Object > {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Task ID');
    }
    const task = await this.taskModel.findByIdAndDelete(id);

    return task;
  }
}
