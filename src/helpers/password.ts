import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export class Password {
  private static saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    Password.saltRounds = this.configService.get<number>('SALT_ROUNDS');
  }

  public static async hashPassword(plainTextPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(Password.saltRounds);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    return hashedPassword;
  }

  public static async Match(
    hashedPassword: string,
    plainTextPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(hashedPassword, plainTextPassword);
    return isMatch;
  }
}
