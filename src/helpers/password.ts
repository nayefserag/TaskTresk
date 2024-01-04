import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
export class Password {
  saltRounds: number;
  constructor( private readonly configService: ConfigService) {
    this.saltRounds = this.configService.get<number>('SALT_ROUNDS');
  }
  public static async hashPassword(plainTextPassword: string): Promise<string> {
    
    
    const salt = await bcrypt.genSalt();
    const hasedpassword = bcrypt.hash(plainTextPassword, salt);
    return hasedpassword;
  }
  public static async Match(
    hasedPassword: string,
    plainTextPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(hasedPassword, plainTextPassword);
    return isMatch;
  }
}
