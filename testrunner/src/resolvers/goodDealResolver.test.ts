import clearDB from "./helpers/clearDB";
import client from "./helpers/getClient";
import { GET_ALL_GOOD_DEALS } from "./helpers/graphql/queries/goodDeal/getAllGoodDeals";

describe("Activity resolver", () => {
  afterAll(async () => {
    await clearDB();
  });

  it("get all goodDeals", async () => {
    const res = await client.query({
      query: GET_ALL_GOOD_DEALS,
      fetchPolicy: "no-cache",
    });
    expect(res.data?.getAllGoodDeals).toEqual([]);
  });
});
