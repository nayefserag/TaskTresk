import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  Email,
  UpdateUserDto,
  UserDto,
  UserPasswordDto,
} from 'src/dto/user.dto';
import { Password } from 'src/helpers/password';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/services/otp/otp.service';
import { MailerService } from 'src/services/mailer/mailer.service';
import { OTPDto, OtpResend } from 'src/dto/otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly mailerService: MailerService,
  ) {}
  @Post('/signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({ type: UserDto }) // Specify the request body DTO for Swagger documentation
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'User created successfully, OTP sent for email verification',
    headers: {
      Token: { description: 'Access token', schema: { type: 'string' } },
      RefreshToken: { description: 'Refresh token', schema: { type: 'string' } },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User already exists or other error' })
  
  async signup(@Body() UserData: UserDto, @Res() res: Response) {
    const existemail = await this.authService.findUser(UserData.email);
    const existname = await this.authService.findUser(
      UserData.email,
      UserData.name,
    );
    if (existname || existemail) {
      return res.status(400).json({ Error: 'User Already Exist' });
    } else {
      const user = await this.authService.createUser(UserData);

      const payload = {
        email: user.email,
        isVerified: user.isVerified,
        id: user._id,
      };
      const token = await this.authService.createToken(
        payload,
        this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
      );
      const refreshToken = await this.authService.createToken(
        {},
        this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      );
      user.refreshToken = refreshToken;
      user.provider = 'TaskTresk';
      const otp = this.otpService.generateOTP();
      user.otp = otp.otp;
      await this.mailerService.sendOtpEmail(user.email, otp.otp);
      await this.authService.updateUser(user._id, user);
      if (user) {
        res
          .status(201)
          .header({ Token: token, RefreshToken: refreshToken })
          .json({
            message:
              'User Created Successfully,We Sent Otp Please Verify Email',
            token: token,
          });
      } else {
        res.status(400).json({ Error: 'User Not Created' });
      }
    }
  }

  @Get('/login')
  @ApiBody({ type: UpdateUserDto }) // Specify the request body DTO for Swagger documentation
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'User logged in successfully',
    headers: {
      Token: { description: 'Access token', schema: { type: 'string' } },
      RefreshToken: { description: 'Refresh token', schema: { type: 'string' } },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User not found or invalid password' })

  async login(@Body() UserData: UpdateUserDto, @Res() res: Response) {
    const user = await this.authService.findUser(UserData.email);
    if (!user) {
      return res.status(400).json({ message: 'User Not Found' });
    }
    if (!(await Password.Match(UserData.password, user.password))) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const payload = {
      email: user.email,
      isVerified: user.isVerified,
      id: user._id,
    };
    const token = await this.authService.createToken(
      payload,
      this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    );
    const refreshToken = await this.authService.createToken(
      {},
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    );
    user.refreshToken = refreshToken;

    await this.authService.updateUser(user._id, user);
    if (user) {
      res
        .status(200)
        .header({ Token: token, RefreshToken: refreshToken })
        .json({ message: 'User Logged In Successfully', token: token });
    }
  }

  @Post('/verify-otp')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: OTPDto }) // Specify the request body DTO for Swagger documentation
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OTP verified successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email not found or invalid OTP' })

  async verifyOtp(@Body() UserData: OTPDto, @Res() res: Response) {
    const user = await this.authService.findUser(UserData.email);
    if (!user) {
      return res.status(400).json({ message: 'Email Not Found' });
    }
    if (user.otp !== UserData.otp) {
      return res.status(400).json({ message: 'Invalid Otp' });
    }
    user.otp = null;
    user.isVerified = true;
    user.updatedAt = new Date();
    await this.authService.updateUser(user._id, user);

    res.status(200).json({ message: 'Otp Verified' });
  }

  @Get('/resend-otp')
  @ApiBody({ type: OtpResend })
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OTP resent successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email not found or other error' })

  async resendOtp(@Body() UserData: OtpResend, @Res() res: Response) {
    const user = await this.authService.findUser(UserData.email);
    if (!user) {
      return res.status(400).json({ message: 'Email Not Found' });
    }
    const otp = this.otpService.generateOTP();
    user.otp = otp.otp;
    await this.mailerService.sendOtpEmail(user.email, otp.otp);
    await this.authService.updateUser(user._id, user);
    res.status(200).json({ message: 'Otp Sent' });
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Access token refreshed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Refresh token not found or invalid' })

  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.headers['refreshtoken'];
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh Token Not Found' });
    }
    await this.authService.verifyRefreshToken(refreshToken);
    const user = await this.authService.findUserByRefreshToken(refreshToken);
    const payload = {
      email: user.email,
      isVerified: user.isVerified,
      id: user._id,
    };
    const token = await this.authService.createToken(
      payload,
      this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    );
    return res
      .status(200)
      .header({ Token: token })
      .json({ message: 'Token Refreshed', accesstoken: token });
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered or logged in successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Google login failed' })
  
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    if (user) {
      const userExist = await this.authService.findUser(user.email);
      if (!userExist) {
        user.name =
          user.name.firstName +
          (user.name.lastName ? ' ' + user.name.lastName : '');

        const newUser = await this.authService.createUser(user);
        newUser.isVerified = true;
        const payload = {
          email: newUser.email,
          isVerified: newUser.isVerified,
          id: newUser._id,
        };
        const token = await this.authService.createToken(
          payload,
          this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
        );
        const refreshToken = await this.authService.createToken(
          {},
          this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
        );
        newUser.refreshToken = refreshToken;
        newUser.provider = 'Google';
        await this.authService.updateUser(newUser._id, newUser);
        res
          .header(this.configService.get('ACCESS_TOKEN_NAME'), token)
          .status(201)
          .json({
            message: `Thanks ${newUser.name} To Register In TaskTresk ^_^`,
            statusCode: 201,
            newUser,
            token,
            refreshToken,
          });
      } else {
        const payload = {
          email: userExist.email,
          isVerified: userExist.isVerified,
          id: userExist._id,
        };
        const token = await this.authService.createToken(
          payload,
          this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
        );
        const refreshToken = await this.authService.createToken(
          {},
          this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
        );
        userExist.refreshToken = refreshToken;
        await this.authService.updateUser(userExist._id, userExist);
        res
          .header(this.configService.get('ACCESS_TOKEN_NAME'), token)
          .status(200)
          .json({
            message: `Welcome Again ${userExist.name} To My TaskTresk ^_^`,
            statusCode: 200,
            refreshToken: refreshToken,
            token: token,
          });
      }
    } else {
      res.redirect('/login?error=google_login_failed');
    }
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Facebook OAuth Callback Redirect' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered or logged in successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Facebook login failed or other error' })
  
  async facebookLoginCallback(@Req() req, @Res() res: Response): Promise<any> {
    try {
      const user = req.user;
      if (user) {
        const userExist = await this.authService.findUser(user.email);
        if (!userExist) {
          user.name =
            user.firstName + (user.lastName ? ' ' + user.lastName : '');
          const newUser = await this.authService.createUser(user);
          newUser.isVerified = true;
          newUser.provider = 'Facebook';
          newUser.FacebookAccessToken = user.accessToken;
          const payload = {
            email: newUser.email,
            isVerified: newUser.isVerified,
            id: newUser._id,
          };
          const token = await this.authService.createToken(
            payload,
            this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
          );
          const refreshToken = await this.authService.createToken(
            {},
            this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
          );
          newUser.refreshToken = refreshToken;
          await this.authService.updateUser(newUser._id, newUser);
          res
            .header(this.configService.get('ACCESS_TOKEN_NAME'), token)
            .status(201)
            .json({
              message: `Thanks ${newUser.name} To Register In TaskTresk ^_^`,
              statusCode: 201,
              newUser,
              token,
              refreshToken,
            });
        } else {
          const payload = {
            email: userExist.email,
            isVerified: userExist.isVerified,
            id: userExist._id,
          };
          const token = await this.authService.createToken(
            payload,
            this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
          );
          const refreshToken = await this.authService.createToken(
            {},
            this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
          );
          userExist.refreshToken = refreshToken;
          await this.authService.updateUser(userExist._id, userExist);
          res
            .header(this.configService.get('ACCESS_TOKEN_NAME'), token)
            .status(200)
            .json({
              message: `Welcome Again ${userExist.name} To My TaskTresk ^_^`,
              statusCode: 200,
              refreshToken: refreshToken,
              token: token,
            });
        }
      } else {
        res.redirect('/login?error=facebook_login_failed');
      }
    } catch (err) {
      return res.json({ Error: err.message });
    }
  }

  @Post('/request-reset')
  @ApiBody({ type: Email }) // Specify the request body DTO for Swagger documentation
  @ApiOperation({ summary: 'Request Password Reset' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset code sent successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email not found or other error' })

  async requestPasswordReset(@Body() UserData: Email, @Res() res: Response) {
    const user = await this.authService.findUser(UserData.email);
    const resetcode = this.otpService.generateOTP();
    await this.mailerService.sendPasswordResetEmail(user.email, resetcode.otp);
    user.otp = resetcode.otp;
    await this.authService.updateUser(user._id, user);
    res.status(200).json({
      message: 'Password Reset Code Sent To Your Email',
      statusCode: 200,
    });
  }

  @Patch('/reset-password')
  @ApiBody({ type: UserPasswordDto }) // Specify the request body DTO for Swagger documentation
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email not found or invalid reset code' })

  async resetPassword(@Body() UserData: UserPasswordDto, @Res() res: Response) {
    const user = await this.authService.findUser(UserData.email);
    if (!user) {
      return res.status(400).json({ message: 'Email Not Found' });
    }
    if (user.otp !== UserData.otp) {
      return res.status(400).json({ message: 'Invalid Reset Code' });
    }
    user.password = await Password.hashPassword(UserData.password);
    user.otp = null;
    await this.authService.updateUser(user._id, user);
    res.status(200).json({ message: 'Password Reset Successfully' });
  }
}
