import { Activity } from "../../entities/activity";
import { Contribution } from "../../entities/contribution";
import { GoodDeal } from "../../entities/goodDeal";
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
  goodDeals: GoodDeal[];
  activities: Activity[];
  contributions: Contribution[];

  createPasswordResetToken: string;
}
