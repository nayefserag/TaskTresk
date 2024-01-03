import { Controller, Delete, Get, Patch, UseGuards, UsePipes } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ConfigService } from '@nestjs/config';
import { Body, ValidationPipe, Post, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { TaskDto, UpdateTaskDto } from 'src/DTOs/task.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private taskservice: TasksService
  ) {}

  @Post('addTask')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createTask(@Body() TaskDto: TaskDto, @Res() res: Response) {
    const newTask = await this.taskservice.createTask(TaskDto);
    if (newTask) {
      res.status(200).json({ message: 'Task Added Successfully' });
    } else {
      res.status(400).json({ message: 'Task Not Added' });
    }
  }

  @Get('getTasks')
  async getTasks(@Res() res: Response) {
    const tasks = await this.taskservice.getTasks();
    if (tasks) {
      res.status(200).json({ tasks: tasks });
    } else {
      res.status(400).json({ message: 'Tasks Not Found' });
    }
  }

  @Get('getTask/:id')
  async getTask(@Res() res: Response, @Param('id') id: string) {
    try {
      const task = await this.taskservice.getTask(id);
      if (task) {
        res.status(200).json({ task: task });
      } else {
        res.status(400).json({ message: 'Task Not Found' });
      }
    } catch (err) {
      res.status(400).json({Error :err.message});
    }
  }

  @Get('getTaskByTitle/:title')
  async getTaskByTitle(@Res() res: Response, @Param('title') title: string) {
    const task = await this.taskservice.getTaskByTitle(title);
    if (task.length ===0){
      return  res.status(400).json({ message: 'Task Not Found' });
    }
    if (task) {
      res.status(200).json({ task: task });
    } else {
      res.status(400).json({ message: 'Task Not Found' });
    }
  }
  @Patch('updateTask/:id')
  async updateTask( @Res() res: Response, @Param('id') id: string, @Body() TaskDto: UpdateTaskDto) {
    try {
      const task = await this.taskservice.updateTask(id, TaskDto);
      if (task) {
        res.status(200).json({ task: task , message: 'Task Updated Successfully'});
      } else {
        res.status(400).json({ message: 'Task Not Found' });
      }
    } catch (err) {
      res.status(400).json({Error :err.message});
    }
  }

  @Delete('deleteTask/:id')
  async deleteTask(@Res() res: Response, @Param('id') id: string) {
    try {
      const task = await this.taskservice.deleteTask(id);
      if (task) {
        res.status(200).json({ task: task , message: 'Task Deleted Successfully'});
      } else {
        res.status(400).json({ message: 'Task Not Found' });
      }
    } catch (err) {
      res.status(400).json({Error :err.message});
    }
  }
}
