import * as bcrypt from 'bcrypt'
export class Password {
public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hasedpassword = bcrypt.hash(password, salt);
    return hasedpassword;
  }
  public static async Match(password1: string , password2 : string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password1, password2);
    return isMatch
  }
}