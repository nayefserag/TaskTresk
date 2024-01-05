import { Body, Controller, Get, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { UsersOperationsService } from './users.operations.service';
import { UpdateUserDto } from 'src/dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks Operations Controller')
@UseGuards(JwtAuthGuard)
@Controller('usersOperations')

export class UsersOperationsController {
  constructor(private operations: UsersOperationsService) {}
  @Get('getallusers')
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error retrieving users' })
 
  async getallusers() {
    const users = await this.operations.getallusers();
    return users;
  }

  @Get('getuser')
  @ApiOperation({ summary: 'Get User by ID or Name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error retrieving user' })
 
  async getuser(@Body('id') id: string = null, @Body('name') name: string) {
    const user = await this.operations.getuser(id, name);
    return user;
  }

  @Get('deleteuser')
  @ApiOperation({ summary: 'Delete User by ID or Name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error deleting user' })
  
  async deleteuser(@Body('id') id: string = null, @Body('name') name?: string) {
    const user = await this.operations.deleteuser(id, name);
    return user;
  }

  @Patch('updateuser/:id')
  @ApiOperation({ summary: 'Update User by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error updating user' })
  
  async updateuser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.operations.updateuser(id, body);
    return user;
  }

  @Get('getuserTasks/:id')
  @ApiOperation({ summary: 'Get User Tasks by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User tasks retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error retrieving user tasks' })
  
  async getuserTasks(@Param('id') id: string) {
    const user = await this.operations.getuserTasks(id);
    return user;
  }

  @Get('getuserCompletedTasks/:id')
  @ApiOperation({ summary: 'Get User Completed Tasks by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User completed tasks retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error retrieving user completed tasks' })
 
  async getuserCompletedTasks(@Param('id') id: string) {
    const user = await this.operations.getuserCompletedTasks(id);
    return user;
  }

  @Get('getuserIncompleteTasks/:id')
  @ApiOperation({ summary: 'Get User Incomplete Tasks by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User incomplete tasks retrieved successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error retrieving user incomplete tasks' })
  
  async getuserIncompleteTasks(@Param('id') id: string) {
    const user = await this.operations.getuserIncompleteTasks(id);
    return user;
  }
}
