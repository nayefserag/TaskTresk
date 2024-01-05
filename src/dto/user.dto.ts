import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';
import { TaskDto } from './task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password@123', description: 'User password' })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'google-id',
    description: 'Google ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  googleid: string;

  @ApiProperty({
    example: true,
    description: 'Verification status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({
    example: '123456',
    description: 'One-Time Password',
    required: false,
  })
  @IsOptional()
  @IsString()
  otp: string;

  @ApiProperty({
    example: 'refresh-token',
    description: 'Refresh token',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  refreshToken: string;

  @ApiProperty({ type: [TaskDto], description: 'User tasks', required: false })
  @IsOptional()
  tasks: TaskDto[];

  @ApiProperty({
    type: Date,
    description: 'Creation timestamp',
    required: false,
  })
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Update timestamp', required: false })
  @IsOptional()
  updatedAt: Date;

  @ApiProperty({ example: 'user-id', description: 'User ID', required: false })
  @IsOptional()
  _id: string;

  @ApiProperty({
    example: 'fb-access-token',
    description: 'Facebook access token',
    required: false,
  })
  @IsOptional()
  FacebookAccessToken: string;

  @ApiProperty({
    example: 'Google',
    description: 'Authentication provider',
    required: false,
  })
  @IsOptional()
  provider: string;
}
export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'new-password123', description: 'New user password' })
  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'google-id',
    description: 'Google ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  googleid: string;

  @ApiProperty({
    example: true,
    description: 'Verification status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({
    example: '123456',
    description: 'One-Time Password',
    required: false,
  })
  @IsOptional()
  @IsString()
  otp: string;

  @ApiProperty({
    example: 'refresh-token',
    description: 'Refresh token',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  refreshToken: string;

  @ApiProperty({ type: [TaskDto], description: 'User tasks', required: false })
  @IsOptional()
  tasks: TaskDto[];
  
  @ApiProperty({ type: Date, description: 'Update timestamp', required: false })
  @IsOptional()
  updatedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Creation timestamp',
    required: false,
  })
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ example: 'user-id', description: 'User ID', required: false })
  @IsOptional()
  _id: string;

  @ApiProperty({
    example: 'fb-access-token',
    description: 'Facebook access token',
    required: false,
  })
  @IsOptional()
  FacebookAccessToken: string;

  @ApiProperty({
    example: 'Google',
    description: 'Authentication provider',
    required: false,
  })
  @IsOptional()
  provider: string;
}

export class UserPasswordDto {
  @ApiProperty({ example: 'new-password123', description: 'New user password' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: '123456', description: 'One-Time Password' })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  email: string;
}

export class Email {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  email: string;
}
