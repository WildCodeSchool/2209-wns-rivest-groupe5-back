import { ITestUser } from "src/interfaces/entitites/testUserInterface";
import clearDB from "./helpers/clearDB";
import { generateTestAdmin } from "./helpers/generate/user/generateTestAdmin";
import { getTokenForUser } from "./helpers/generate/user/getTokenForUser";
import client from "./helpers/getClient";
import { CREATE_ACTIVITY_TYPE } from "./helpers/graphql/mutations/activityType/createActivityType";
import { GET_ALL_ACTIVITY_TYPES } from "./helpers/graphql/queries/actitityType/getAllActivityType";

describe("ActivityType resolver", () => {
  let testAdmin: ITestUser;
  let testAdminToken: string;

  beforeAll(async () => {
    testAdmin = await generateTestAdmin();
    testAdminToken = await getTokenForUser("test", testAdmin.email);
  });

  afterAll(async () => {
    await clearDB();
  });

  it("get all activityTypes", async () => {
    const res = await client.query({
      query: GET_ALL_ACTIVITY_TYPES,
      fetchPolicy: "no-cache",
    });
    expect(res.data?.getAllActivityTypes).toEqual([]);
  });

  it("create activityType", async () => {
    const res = await client.mutate({
      mutation: CREATE_ACTIVITY_TYPE,
      variables: {
        name: "transport",
      },
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: testAdminToken,
        },
      },
    });
    expect(res.data.createActivityType.name).toEqual("transport");
  });
});
