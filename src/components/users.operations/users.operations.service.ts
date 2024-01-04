import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TaskDto } from 'src/dto/task.dto';
import { UpdateUserDto, UserDto } from 'src/dto/user.dto';
import { Password } from 'src/helpers/password';

@Injectable()
export class UsersOperationsService {
  constructor(
    @InjectModel('user') private userModel: Model<UserDto>,
    @InjectModel('Task') private taskModel: Model<TaskDto>,
  ) {}
  async getallusers(): Promise<UserDto[] | NotFoundException> {
    const users = await this.userModel.find({});
    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async getuser(
    id: string,
    name?: string,
  ): Promise<UserDto | NotFoundException | any> {
    if (name) {
      const user = await this.userModel.findOne({ name });
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      return user;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid User ID');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async deleteuser(
    id: string,
    name: string = null,
  ): Promise<UserDto | NotFoundException> {
    const user = await this.getuser(id, name);
    await this.userModel.findByIdAndDelete(id);
    return user;
  }

  async updateuser(
    id: string,
    body: UserDto,
  ): Promise<UpdateUserDto | NotFoundException> {
    let user = await this.getuser(id, null);
    if (body.password) {
      body.password = await Password.hashPassword(body.password);
    }
    if (body.name) {
      let user = await this.userModel.findOne({ name: body.name });
      if (user) {
        throw new NotFoundException(
          'This name is already exist choose another name',
        );
      }
      body.name = body.name;
    }
    user = await this.userModel.findByIdAndUpdate(id, body, { new: true });
    return user;
  }

  async getuserTasks(
    id: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TaskDto[] | NotFoundException> {
    const user = await this.getuser(id);

    const skip = (page - 1) * limit;
    const tasks = await this.taskModel
      .find({ authorId: user.name })
      .skip(skip)
      .limit(limit);

    if (tasks.length === 0) {
      throw new NotFoundException(
        'This User Does Not Have Any Tasks on This Page',
      );
    }

    return tasks;
  }

  async getuserCompletedTasks(userid: string): Promise<TaskDto[]> {
    const tasks: any = await this.getuserTasks(userid);
    const completedTasks = tasks.filter((task) => task.isCompleted === true);
    if (completedTasks.length === 0) {
      throw new NotFoundException('This User Dont Have Any Completed Task');
    }
    return completedTasks;
  }

  async getuserIncompleteTasks(userid: string): Promise<TaskDto[]> {
    const tasks: any = await this.getuserTasks(userid);
    const incompleteTasks = tasks.filter((task) => task.isCompleted === false);
    if (incompleteTasks.length === 0) {
      throw new NotFoundException('This User Dont Have Any Incomplete Task');
    }
    return incompleteTasks;
  }
}
