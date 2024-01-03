import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserDto } from 'src/dto/user.dto';
import { Password } from 'src/helpers/password';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<UserDto>,
    private jwtService: JwtService,
  ) {}

  async createUser(body: UserDto): Promise<UserDto> {
    const user = await this.userModel.create(body);
    user.password = await Password.hashPassword(user.password);

    await this.updateUser(user._id, user);
    return user;
  }

  async findUser(email: string, name?: string): Promise<UserDto> {
    if (name) {
      const user = await this.userModel.findOne({ name });
      return user;
    }
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findUserById(id: string): Promise<UserDto> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid User ID');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async updateUser(id: string, body: UserDto): Promise<UserDto | Error> {
    const user = await this.findUserById(id);
    await this.userModel.findByIdAndUpdate(id, body, { new: true });
    return user;
  }

  async deleteUser(id: string): Promise<UserDto | Error | Object> {
    const user = await this.findUserById(id);
    await this.userModel.findByIdAndDelete(id);
    return user;
  }

  async createToken(payload: any): Promise<string> {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async decodeToken(token: string): Promise<any> {
    const decoded = await this.jwtService.decode(token);
    return decoded;
  }

  async verifyRefreshToken(refreshToken: string): Promise<any> {
    return this.jwtService.verify(refreshToken);
  }

  async findUserByRefreshToken(refreshToken: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ refreshToken });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }
}
