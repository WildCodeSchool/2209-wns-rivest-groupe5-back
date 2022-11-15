export interface IUser {
  userId: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  avatar?: string;
  createdAt: Date;
}
