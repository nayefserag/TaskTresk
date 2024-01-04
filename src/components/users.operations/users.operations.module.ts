import { Module } from '@nestjs/common';
import { UsersOperationsController } from './users.operations.controller';
import { UsersOperationsService } from './users.operations.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schema/users.schema';
import { TaskSchema } from 'src/Schema/task.schema';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  exports: [MongooseModule],
  controllers: [UsersOperationsController],
  providers: [UsersOperationsService ,JwtAuthGuard ,AuthService]
})
export class UsersOperationsModule {}
