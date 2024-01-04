import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UpdateUserDto, UserDto } from 'src/dto/user.dto';
import { Password } from 'src/helpers/password';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/services/otp/otp.service';
import { MailerService } from 'src/services/mailer/mailer.service';
import { OTPDto, OtpResend } from 'src/dto/otp.dto';
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
}
