import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schema/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OtpService } from 'src/services/otp/otp.service';
import { MailerService } from 'src/services/mailer/mailer.service';
import { GoogleAuthService } from 'src/strategy/google-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from 'src/strategy/facebook.strategy';
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
    PassportModule.register({
      defaultStrategy: 'facebook',
    }),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, MailerService, GoogleAuthService , FacebookStrategy,GoogleCalendarService],
})
export class AuthModule {}
