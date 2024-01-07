import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/Schema/task.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { UserSchema } from 'src/Schema/users.schema';
import { UsersOperationsService } from '../users.operations/users.operations.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleCalendarService } from 'src/services/google calender/google-calendar.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    
  ],
  controllers: [TasksController],
  providers: [TasksService,JwtAuthGuard,UsersOperationsService ,GoogleCalendarService],
})
export class TasksModule {}
