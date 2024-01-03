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
// import { JwtService } from '@nestjs/jwt';
import { Password } from 'src/helpers/password';
// @UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
        isActive: user.isActive,
        id: user._id,
      };
      const token = await this.authService.createToken(payload);
      const refreshToken = await this.authService.createToken({});
      user.refreshToken = refreshToken;
      await this.authService.updateUser(user._id, user);
      if (user) {
        res
          .status(201)
          .header({ Token: token, RefreshToken: refreshToken })
          .json({ message: 'User Created Successfully', token: token });
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
      isActive: user.isActive,
      id: user._id,
    };
    const token = await this.authService.createToken(payload);
    const refreshToken = await this.authService.createToken({});
    user.refreshToken = refreshToken;

    await this.authService.updateUser(user._id, user);
    if (user) {
      res
        .status(200)
        .header({ Token: token, RefreshToken: refreshToken })
        .json({ message: 'User Logged In Successfully', token: token });
    }
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
      isActive: user.isActive,
      id: user._id,
    };
    const token = await this.authService.createToken(payload);
    return res
      .status(200)
      .header({ Token: token })
      .json({ message: 'Token Refreshed', accesstoken: token });
  }
}
