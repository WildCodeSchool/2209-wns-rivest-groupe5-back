import clearDB from "./helpers/clearDB";
import client from "./helpers/getClient";
import { GET_ALL_CONTRIBUTION } from "./helpers/graphql/queries/contribution/getAllContribution";

describe("Contribution resolver", () => {
  afterAll(async () => {
    await clearDB();
  });

  it("get all contributions", async () => {
    const res = await client.query({
      query: GET_ALL_CONTRIBUTION,
      fetchPolicy: "no-cache",
    });
    expect(res.data?.getAllContributions).toEqual([]);
  });
});
