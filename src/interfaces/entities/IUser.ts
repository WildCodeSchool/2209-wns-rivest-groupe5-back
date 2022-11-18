import { USER_ROLES } from "../../utils/userRoles";

export interface IUser {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  role: USER_ROLES;

  createPasswordResetToken: string;
}
