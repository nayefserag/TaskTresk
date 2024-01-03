import { Module } from '@nestjs/common';
import { UsersOperationsController } from './users.operations.controller';
import { UsersOperationsService } from './users.operations.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schema/users.schema';
import { TaskSchema } from 'src/Schema/task.schema';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
  ],
  exports: [MongooseModule],
  controllers: [UsersOperationsController],
  providers: [UsersOperationsService ,JwtAuthGuard ,AuthService]
})
export class UsersOperationsModule {}
