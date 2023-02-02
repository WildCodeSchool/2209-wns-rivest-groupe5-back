import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "apollo-server-core";
import { Activity } from "../entities/activity";
import { IUserCtx } from "../interfaces/general/IUserCtx";
import dataSource from "../utils/datasource";
import {
  getDateXDaysAgoDaysInfos,
  getDateXMonthsAgoInfos,
  getDateXWeeksAgoInfos,
} from "../utils/dates/datesUtils";
import { Between, MoreThan } from "typeorm";
import { IObjectActivitiesArray } from "../interfaces/general/IObjectActivitiesArray";
import { IObjectGraphDataset } from "../interfaces/general/IObjectGraphDataset";
import {
  ObjectGraphDataset,
  ObjectGraphDatasetPie,
} from "../entities/graphs/objectGraphDataset";
import { ACTIVITY_TYPES } from "../const/activityTypesValues";
import { IActivity } from "../interfaces/entities/IActivity";
import { IPeriodInfos } from "../interfaces/general/IPeriodInfos";

const getBaseDataForGraphObj = (
  timeInfos: IPeriodInfos[]
): IObjectGraphDataset => {
  return {
    labels: timeInfos.map((timeUnit) => timeUnit.name),
    datasets: [
      {
        ...ACTIVITY_TYPES.transport,
        data: [],
      },
      {
        ...ACTIVITY_TYPES.numeric,
        data: [],
      },
      {
        ...ACTIVITY_TYPES.food,
        data: [],
      },
      {
        ...ACTIVITY_TYPES.energy,
        data: [],
      },
      {
        ...ACTIVITY_TYPES.appliance,
        data: [],
      },
      {
        ...ACTIVITY_TYPES.other,
        data: [],
      },
    ],
  };
};

const getBaseActivitiesPerActivityTypesObj = (): IObjectActivitiesArray => {
  return {
    transport: [],
    numeric: [],
    food: [],
    energy: [],
    appliance: [],
    other: [],
  };
};

const distributeActivityPerActivityTypeInObj = (
  activities: Activity[],
  toObj: IObjectActivitiesArray
) => {
  activities.forEach((activity) => {
    const activityConverted: IActivity = {
      ...activity,
      carbonQuantity: parseFloat((activity.carbonQuantity / 1000).toFixed(3)),
    };
    console.log(
      "🚀 ~ file: getStatsResolver.ts:73 ~ activities.forEach ~ activityConverted carbon rounded",
      activityConverted.carbonQuantity
    );

    switch (activity.activityType.activityTypeId) {
      case 1:
        toObj.transport.push(activityConverted);
        break;
      case 2:
        toObj.numeric.push(activityConverted);
        break;
      case 3:
        toObj.food.push(activityConverted);
        break;
      case 4:
        toObj.energy.push(activityConverted);
        break;
      case 5:
        toObj.appliance.push(activityConverted);
        break;
      default:
        toObj.other.push(activityConverted);
    }
  });
};

@Resolver(ObjectGraphDataset)
export class GetStatsResolver {
  @Authorized()
  @Query(() => ObjectGraphDataset)
  async getMyLastWeekActivities(
    @Ctx() ctx: Context
  ): Promise<IObjectGraphDataset> {
    const userFromCtx = ctx as IUserCtx;

    const lastDaysInfos = getDateXDaysAgoDaysInfos(7);

    const dataForGraph = getBaseDataForGraphObj(lastDaysInfos);

    for await (const day of lastDaysInfos) {
      // get all activities per day
      const activitiesOfTheDay = await dataSource.getRepository(Activity).find({
        relations: {
          activityType: true,
        },
        where: {
          user: {
            userId: userFromCtx.user.userId,
          },
          activityDate: Between(day.start, day.end),
        },
      });

      // Group activities of the day per activityType
      const totalPerActivityType = getBaseActivitiesPerActivityTypesObj();

      // for each activityType, sum total of carbonQuantity
      distributeActivityPerActivityTypeInObj(
        activitiesOfTheDay,
        totalPerActivityType
      );

      Object.keys(totalPerActivityType).forEach(function (key, index) {
        // calculate total, default value at 0
        let totalCarbonPerActivityTypeOfTheDay = 0;

        if (totalPerActivityType[key].length !== 0) {
          totalCarbonPerActivityTypeOfTheDay = totalPerActivityType[key].reduce(
            (acc, curr) => acc + curr.carbonQuantity,
            0
          );
        }

        // add value to the data object
        const targetDataset = dataForGraph.datasets.find(
          (dataset) => dataset.name === key
        );

        targetDataset?.data.push(totalCarbonPerActivityTypeOfTheDay);
      });
    }

    return dataForGraph;
  }

  @Authorized()
  @Query(() => ObjectGraphDataset)
  async getMyLastMonthActivities(
    @Ctx() ctx: Context
  ): Promise<IObjectGraphDataset> {
    const userFromCtx = ctx as IUserCtx;

    const lastWeeksInfos = getDateXWeeksAgoInfos(4);

    const dataForGraph = getBaseDataForGraphObj(lastWeeksInfos);

    for await (const week of lastWeeksInfos) {
      // get all activities per week
      const activitiesOfTheWeek = await dataSource
        .getRepository(Activity)
        .find({
          relations: {
            activityType: true,
          },
          where: {
            user: {
              userId: userFromCtx.user.userId,
            },
            activityDate: Between(week.start, week.end),
          },
        });

      // Group activities of the day per activityType
      const totalPerActivityType = getBaseActivitiesPerActivityTypesObj();

      // for each activityType, sum total of carbonQuantity
      distributeActivityPerActivityTypeInObj(
        activitiesOfTheWeek,
        totalPerActivityType
      );

      Object.keys(totalPerActivityType).forEach(function (key, index) {
        // calculate total, default value at 0
        let totalCarbonPerActivityTypeOfTheWeek = 0;

        if (totalPerActivityType[key].length !== 0) {
          totalCarbonPerActivityTypeOfTheWeek = totalPerActivityType[
            key
          ].reduce((acc, curr) => acc + curr.carbonQuantity, 0);
        }

        // add value to the data object
        const targetDataset = dataForGraph.datasets.find(
          (dataset) => dataset.name === key
        );

        targetDataset?.data.push(totalCarbonPerActivityTypeOfTheWeek);
      });
    }

    return dataForGraph;
  }

  @Authorized()
  @Query(() => ObjectGraphDataset)
  async getMyLastYearActivities(
    @Ctx() ctx: Context
  ): Promise<IObjectGraphDataset> {
    const userFromCtx = ctx as IUserCtx;

    const lastYearsInfos = getDateXMonthsAgoInfos(12);

    const dataForGraph = getBaseDataForGraphObj(lastYearsInfos);

    for await (const month of lastYearsInfos) {
      // get all activities per month
      const activitiesOfTheMonth = await dataSource
        .getRepository(Activity)
        .find({
          relations: {
            activityType: true,
          },
          where: {
            user: {
              userId: userFromCtx.user.userId,
            },
            activityDate: Between(month.start, month.end),
          },
        });

      // Group activities of the day per activityType
      const totalPerActivityType = getBaseActivitiesPerActivityTypesObj();

      // for each activityType, sum total of carbonQuantity
      distributeActivityPerActivityTypeInObj(
        activitiesOfTheMonth,
        totalPerActivityType
      );

      Object.keys(totalPerActivityType).forEach(function (key, index) {
        // calculate total, default value at 0
        let totalCarbonPerActivityTypeOfTheMonth = 0;

        if (totalPerActivityType[key].length !== 0) {
          totalCarbonPerActivityTypeOfTheMonth = totalPerActivityType[
            key
          ].reduce((acc, curr) => acc + curr.carbonQuantity, 0);
        }

        // add value to the data object
        const targetDataset = dataForGraph.datasets.find(
          (dataset) => dataset.name === key
        );

        targetDataset?.data.push(totalCarbonPerActivityTypeOfTheMonth);
      });
    }

    return dataForGraph;
  }

  @Authorized()
  @Query(() => ObjectGraphDatasetPie)
  async getMyTotalCarbonPerActivityType(
    @Ctx() ctx: Context
  ): Promise<IObjectGraphDataset> {
    const userFromCtx = ctx as IUserCtx;

    const allActivitiesOfTheUser = await dataSource
      .getRepository(Activity)
      .find({
        relations: {
          activityType: true,
        },
        where: {
          user: {
            userId: userFromCtx.user.userId,
          },
        },
      });

    const labels = [];
    const colors = [];
    const sums = [];
    const emojis = [];

    let key: keyof typeof ACTIVITY_TYPES;
    for (key in ACTIVITY_TYPES) {
      labels.push(ACTIVITY_TYPES[key].label);
      colors.push(ACTIVITY_TYPES[key].backgroundColor);
      emojis.push(ACTIVITY_TYPES[key].emoji);
      sums.push(0);
    }

    for (const activity of allActivitiesOfTheUser) {
      if (
        activity.activityType.activityTypeId < 1 ||
        activity.activityType.activityTypeId > 6
      ) {
        sums[5] += activity.carbonQuantity; // default add to "other"
      } else {
        // add to sum per category, diff of -1 from activityType ID to index of array
        sums[activity.activityType.activityTypeId - 1] +=
          activity.carbonQuantity;
      }
    }

    const roundedSums = sums.map((sum) => parseFloat((sum / 1000).toFixed(3)));

    const dataForGraph: IObjectGraphDataset = {
      labels,
      datasets: [
        {
          id: 0,
          name: "all",
          label: "Quantité (kg)",
          emoji: emojis,
          backgroundColor: colors,
          data: roundedSums,
        },
      ],
    };

    return dataForGraph;
  }
}
