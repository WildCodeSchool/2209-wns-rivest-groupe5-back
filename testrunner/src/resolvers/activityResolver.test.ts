import { ApolloError } from "@apollo/client";
import { ITestActivity } from "src/interfaces/entitites/testActivityInterface";
import { ITestActivityType } from "src/interfaces/entitites/testActivityTypeInterface";
import { ITestUser } from "src/interfaces/entitites/testUserInterface";
import clearDB from "./helpers/clearDB";
import { generateTestActivity } from "./helpers/generate/activity/generateActivity";
import { generateTestActivityType } from "./helpers/generate/activityType/generateActivityType";
import { generateTestAdmin } from "./helpers/generate/user/generateTestAdmin";
import { generateTestUser } from "./helpers/generate/user/generateTestUser";
import { getTokenForUser } from "./helpers/generate/user/getTokenForUser";
import client from "./helpers/getClient";
import { CREATE_ACTIVITY } from "./helpers/graphql/mutations/activity/createActivity";
import { UPDATE_ACTIVITY } from "./helpers/graphql/mutations/activity/updateActivity";
import { GET_ALL_ACTIVITIES } from "./helpers/graphql/queries/activity/getAllActivities";

describe("Activity resolver", () => {
  let testUser: ITestUser;
  let testUserToken: string;
  let testUser2: ITestUser;
  let testUserToken2: string;
  let testAdmin: ITestUser;
  let testAdminToken: string;
  let testActivityType: ITestActivityType;
  const activitytypetest = "testactivitytype";
  let testActivity: ITestActivity;

  beforeAll(async () => {
    testUser = await generateTestUser();
    testUserToken = await getTokenForUser("test", testUser.email);
    testUser2 = await generateTestUser();
    testUserToken2 = await getTokenForUser("test", testUser2.email);
    testAdmin = await generateTestAdmin();
    testAdminToken = await getTokenForUser("test", testAdmin.email);

    testActivityType = await generateTestActivityType(
      activitytypetest,
      testAdminToken
    );

    testActivity = await generateTestActivity(
      testActivityType.activityTypeId,
      testUserToken
    );
  });

  afterAll(async () => {
    await clearDB();
  });

  it("get all activites", async () => {
    const res = await client.query({
      query: GET_ALL_ACTIVITIES,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: testUserToken,
        },
      },
    });
    expect(res.data?.getAllActivities.length).toEqual(1);
  });

  it("create activity", async () => {
    const res = await client.mutate({
      mutation: CREATE_ACTIVITY,
      variables: {
        data: {
          activityTypeId: testActivityType.activityTypeId,
          description: "This is a test Activity",
          carbonQuantity: 10,
          title: "Test Activity",
        },
      },
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: testUserToken,
        },
      },
    });
    expect(res.data.createActivity.user.email).toEqual(testUser.email);
    expect(res.data.createActivity.activityType.name).toEqual(activitytypetest);
    expect(res.data.createActivity.carbonQuantity).toEqual(10);
  });

  it("disallow update activity if user is not the creator and not admin", async () => {
    let apolloError;
    try {
      await client.mutate({
        mutation: UPDATE_ACTIVITY,
        variables: {
          activityId: testActivity.activityId,
          data: {
            title: "updatedTitle",
          },
        },
        fetchPolicy: "no-cache",
        context: {
          headers: {
            authorization: testUserToken2,
          },
        },
      });
    } catch (error) {
      apolloError = error;
    }

    expect(apolloError).not.toBeUndefined();
    expect(apolloError instanceof ApolloError).toBeTruthy();
  });

  it("allow update activity if user is the creator", async () => {
    const res = await client.mutate({
      mutation: UPDATE_ACTIVITY,
      variables: {
        activityId: testActivity.activityId,
        data: {
          title: "updatedTitle",
        },
      },
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: testUserToken,
        },
      },
    });

    expect(res.data.updateActivity.title).toEqual("updatedTitle");
  });
});
