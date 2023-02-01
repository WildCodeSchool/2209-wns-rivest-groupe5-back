import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "apollo-server-core";
import { Activity } from "../entities/activity";
import { IUserCtx } from "../interfaces/general/IUserCtx";
import dataSource from "../utils/datasource";
import { getDateXDaysAgoDaysInfos } from "../utils/dates/datesUtils";
import { Between, MoreThan } from "typeorm";
import { IObjectActivitiesArray } from "../interfaces/general/IObjectActivitiesArray";
import { IObjectGraphDataset } from "../interfaces/general/IObjectGraphDataset";
import {
  ObjectGraphDataset,
  ObjectGraphDatasetPie,
} from "../entities/graphs/objectGraphDataset";
import { ACTIVITY_TYPES } from "../const/activityTypesValues";

@Resolver(ObjectGraphDataset)
export class GetStatsResolver {
  @Authorized()
  @Query(() => ObjectGraphDataset)
  async getMyLastWeekActivities(
    @Ctx() ctx: Context
  ): Promise<IObjectGraphDataset> {
    const userFromCtx = ctx as IUserCtx;

    const lastDaysInfos = getDateXDaysAgoDaysInfos(7);

    const dataForGraph: IObjectGraphDataset = {
      labels: lastDaysInfos.map((day) => day.name),
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
      const totalPerActivityType: IObjectActivitiesArray = {
        transport: [],
        numeric: [],
        food: [],
        energy: [],
        appliance: [],
        other: [],
      };

      // for each activityType, sum total of carbonQuantity
      activitiesOfTheDay.forEach((activity) => {
        switch (activity.activityType.activityTypeId) {
          case 1:
            totalPerActivityType.transport.push(activity);
            break;
          case 2:
            totalPerActivityType.numeric.push(activity);
            break;
          case 3:
            totalPerActivityType.alimentation.push(activity);
            break;
          case 4:
            totalPerActivityType.energy.push(activity);
            break;
          case 5:
            totalPerActivityType.appliance.push(activity);
            break;
          default:
            totalPerActivityType.other.push(activity);
        }
      });

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

    const dataForGraph: IObjectGraphDataset = {
      labels,
      datasets: [
        {
          id: 0,
          name: "all",
          label: "Quantité (kg)",
          emoji: emojis,
          backgroundColor: colors,
          data: sums,
        },
      ],
    };

    return dataForGraph;
  }
}
