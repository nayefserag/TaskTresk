import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class OTPDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email for OTP verification' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'One-Time Password for verification' })
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class OtpResend {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email for OTP resend' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
