import { IsBoolean, IsNotEmpty, IsString, IsOptional, MinLength, IsNumber, IsEmail, IsStrongPassword } from 'class-validator';
import { TaskDto } from './task.dto';

export class UserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsNumber()
    otp : Number

    @IsOptional()
    @IsString()
    @MinLength(6)
    refreshToken: string;

    @IsOptional()
    tasks: TaskDto[];

    @IsOptional()
    createdAt: Date;

    @IsOptional()
    updatedAt: Date;

    @IsOptional()
    deletedAt: Date;

    @IsOptional()
    _id: string;
  
}
export class UpdateUserDto {

    
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsNumber()
    otp : Number

    @IsOptional()
    @IsString()
    @MinLength(6)
    refreshToken: string;

    @IsOptional()
    tasks: TaskDto[];
    
    @IsOptional()
    updatedAt: Date;

    @IsOptional()
    createdAt: Date;

    @IsOptional()
    deletedAt: Date;

    @IsOptional()
    _id: string;



}