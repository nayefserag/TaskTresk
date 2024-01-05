import { Module } from '@nestjs/common';
import { TasksModule } from './components/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './components/auth/auth.module';
import { UsersOperationsModule } from './components/users.operations/users.operations.module';
import { UsersOperationsService } from './components/users.operations/users.operations.service';
import { TasksService } from './components/tasks/tasks.service';
import { GoogleAuthService } from './strategy/google-auth.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    TasksModule,
    AuthModule,
    UsersOperationsModule,
  ],
  providers: [UsersOperationsService, TasksService, GoogleAuthService ,FacebookStrategy],
})
export class AppModule {}
