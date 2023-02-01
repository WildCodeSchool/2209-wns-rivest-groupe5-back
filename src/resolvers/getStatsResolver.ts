import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "apollo-server-core";
import { Activity } from "../entities/activity";
import { IUserCtx } from "../interfaces/general/IUserCtx";
import dataSource from "../utils/datasource";
import {
  getDateXDaysAgo,
  getDateXDaysAgoDaysInfos,
} from "../utils/dates/datesUtils";
import { Between, MoreThan } from "typeorm";
import { IObjectActivitiesArray } from "../interfaces/general/IObjectActivitiesArray";
import { IObjectGraphDataset } from "../interfaces/general/IObjectGraphDataset";
import { ObjectGraphDataset } from "../entities/graphs/objectGraphDataset";

@Resolver(ObjectGraphDataset)
export class GetStatsResolver {
  @Authorized()
  @Query(() => ObjectGraphDataset)
  async getMyLastWeekActivities(
    @Ctx() ctx: Context
  ): Promise<IObjectGraphDataset> {
    const userFromCtx = ctx as IUserCtx;

    // const targetActivities = await getActivitiesFromXDaysAgo(userFromCtx, 7);
    const lastDaysInfos = getDateXDaysAgoDaysInfos(7);

    const dataForGraph: IObjectGraphDataset = {
      labels: lastDaysInfos.map((day) => day.name),
      datasets: [
        {
          id: 1,
          name: "transport",
          label: "Transport",
          emoji: "🚗",
          backgroundColor: "#f9ca24",
          data: [],
        },
        {
          id: 2,
          name: "numeric",
          label: "Numérique",
          emoji: "💻",
          backgroundColor: "#f0932b",
          data: [],
        },
        {
          id: 3,
          name: "food",
          label: "Alimentation",
          emoji: "🍕",
          backgroundColor: "#eb4d4b",
          data: [],
        },
        {
          id: 4,
          name: "energy",
          label: "Energie",
          emoji: "⚡",
          backgroundColor: "#6ab04c",
          data: [],
        },
        {
          id: 5,
          name: "appliance",
          label: "Electroménager",
          emoji: "🚿",
          backgroundColor: "#7ed6df",
          data: [],
        },
        {
          id: 6,
          name: "other",
          label: "Autre",
          emoji: "🤷‍♂️",
          backgroundColor: "#686de0",
          data: [],
        },
      ],
    };

    await Promise.all(
      lastDaysInfos.map(async (day) => {
        // get all activities per day
        const activitiesOfTheDay = await dataSource
          .getRepository(Activity)
          .find({
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
            totalCarbonPerActivityTypeOfTheDay = totalPerActivityType[
              key
            ].reduce((acc, curr) => acc + curr.carbonQuantity, 0);
          }

          // add value to the data object
          const targetDataset = dataForGraph.datasets.find(
            (dataset) => dataset.name === key
          );

          targetDataset?.data.push(totalCarbonPerActivityTypeOfTheDay);
        });
      })
    );

    return dataForGraph;
  }
}
