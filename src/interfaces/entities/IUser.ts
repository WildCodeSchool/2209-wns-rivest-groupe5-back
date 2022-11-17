export interface IUser {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  createPasswordResetToken: string[];
}
