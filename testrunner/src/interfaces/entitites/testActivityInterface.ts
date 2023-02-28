import { ITestActivityType } from "./testActivityTypeInterface";

interface IActivityUserInfos {
  userId: number;
  email: string;
}

export interface ITestActivity {
  activityId: number;
  title: string;
  user: IActivityUserInfos;
  activityType: ITestActivityType;
}
