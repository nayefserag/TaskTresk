import {IsNotEmpty, IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';


export class OTPDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    otp : string

}

export class OtpResend {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

}
