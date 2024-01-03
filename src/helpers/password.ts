import * as bcrypt from 'bcrypt'
export class Password {
public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hasedpassword = bcrypt.hash(password, salt);
    return hasedpassword;
  }
  public static async Match(hasedPassword: string , plainTextPassword : string): Promise<boolean> {
    const isMatch = await bcrypt.compare(hasedPassword, plainTextPassword);
    return isMatch
  }
}