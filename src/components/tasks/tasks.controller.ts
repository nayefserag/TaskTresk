import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

import { Body, ValidationPipe, Post, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { TaskDto, UpdateTaskDto } from 'src/dto/task.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { ApiTags, ApiBody, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Tasks Operations Controller')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private taskservice: TasksService) {}

  @Post('addTask')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: TaskDto })
  @ApiOperation({ summary: 'Create a Task' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task added successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Task not added or validation error' })
 
  async createTask(@Body() TaskDto: TaskDto, @Res() res: Response) {
    const newTask = await this.taskservice.createTask(TaskDto);
    if (newTask) {
      res.status(200).json({ message: 'Task Added Successfully' });
    } else {
      res.status(400).json({ message: 'Task Not Added' });
    }
  }

  @Get('getTasks')
  @ApiOperation({ summary: 'Get All Tasks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Tasks not found or other error' })
  
  async getTasks(@Res() res: Response) {
    const tasks = await this.taskservice.getTasks();
    if (tasks) {
      res.status(200).json({ tasks: tasks });
    } else {
      res.status(400).json({ message: 'Tasks Not Found' });
    }
  }

  @Get('getTask/:id')
  @ApiOperation({ summary: 'Get a Task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' }) // Specify the parameter in the path for Swagger documentation
  @ApiResponse({ status: HttpStatus.OK, description: 'Task retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Task not found or other error' })
  
  async getTask(@Res() res: Response, @Param('id') id: string) {
    try {
      const task = await this.taskservice.getTask(id);
      if (task) {
        res.status(200).json({ task: task });
      } else {
        res.status(400).json({ message: 'Task Not Found' });
      }
    } catch (err) {
      res.status(400).json({ Error: err.message });
    }
  }

  @Get('getTaskByTitle/:title')
  @ApiOperation({ summary: 'Get a Task by Title' })
  @ApiParam({ name: 'title', description: 'Task Title' }) // Specify the parameter in the path for Swagger documentation
  @ApiResponse({ status: HttpStatus.OK, description: 'Task retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Task not found or other error' })
  
  async getTaskByTitle(@Res() res: Response, @Param('title') title: string) {
    const task = await this.taskservice.getTaskByTitle(title);
    if (task.length === 0) {
      return res.status(400).json({ message: 'Task Not Found' });
    }
    if (task) {
      res.status(200).json({ task: task });
    } else {
      res.status(400).json({ message: 'Task Not Found' });
    }
  }
  @Patch('updateTask/:id')
  @ApiOperation({ summary: 'Update a Task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' }) // Specify the parameter in the path for Swagger documentation
  @ApiBody({ type: UpdateTaskDto }) // Specify the request body DTO for Swagger documentation
  @ApiResponse({ status: HttpStatus.OK, description: 'Task updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Task not found or other error' })
  
  async updateTask(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() TaskDto: UpdateTaskDto,
  ) {
    try {
      const task = await this.taskservice.updateTask(id, TaskDto);
      if (task) {
        res.status(200).json({ message: 'Task Updated Successfully' });
      } else {
        res.status(400).json({ message: 'Task Not Found' });
      }
    } catch (err) {
      res.status(400).json({ Error: err.message });
    }
  }

  @Delete('deleteTask/:id')
  @ApiOperation({ summary: 'Delete a Task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' }) // Specify the parameter in the path for Swagger documentation
  @ApiResponse({ status: HttpStatus.OK, description: 'Task deleted successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Task not found or other error' })
 
  async deleteTask(@Res() res: Response, @Param('id') id: string) {
    try {
      const task = await this.taskservice.deleteTask(id);
      if (task) {
        res.status(200).json({ message: 'Task Deleted Successfully' });
      } else {
        res.status(400).json({ message: 'Task Not Found' });
      }
    } catch (err) {
      res.status(400).json({ Error: err.message });
    }
  }
}
