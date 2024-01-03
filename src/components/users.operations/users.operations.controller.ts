import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { UsersOperationsService } from './users.operations.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto, UserDto } from 'src/DTOs/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('usersOperations')

// @UseGuards(AuthGuard('jwt'))
export class UsersOperationsController {
  constructor(
    private operations: UsersOperationsService,
  ) {}
  @Get('getallusers')
  async getallusers() {
    const users = await this.operations.getallusers();
    return users;
  }

  @Get('getuser')
  async getuser(@Body('id') id: string = null , @Body('name') name: string) {
    const user = await this.operations.getuser(id ,name);
    return user;
  }

  @Get('deleteuser')
  async deleteuser(@Body('id') id: string = null , @Body('name') name?: string) {
    const user = await this.operations.deleteuser(id, name);
    return user;
  }

  @Patch('updateuser/:id')
  async updateuser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.operations.updateuser(id, body);
    return user;
  }

  @Get('getuserTasks/:id')
  async getuserTasks(@Param('id') id: string) {
    const user = await this.operations.getuserTasks(id);
    return user;
  }


  @Get('getuserCompletedTasks/:id')
  async getuserCompletedTasks(@Param('id') id: string) {
    const user = await this.operations.getuserCompletedTasks(id);
    return user;
  }

  @Get('getuserIncompleteTasks/:id')
  async getuserIncompleteTasks(@Param('id') id: string) {
    const user = await this.operations.getuserIncompleteTasks(id);
    return user;
  }
  
  

  
}
