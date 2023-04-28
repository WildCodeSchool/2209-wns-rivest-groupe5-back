import client from "./helpers/getClient";
import clearDB from "./helpers/clearDB";
import { CREATE_USER } from "./helpers/graphql/mutations/user/createUser";
import { GET_TOKEN } from "./helpers/graphql/queries/user/getToken";
import { GET_MY_USER_DATA } from "./helpers/graphql/queries/user/getMyUserData";
import { GET_USER_BY_ID } from "./helpers/graphql/queries/user/getUserById";
import { getTokenForUser } from "./helpers/generate/user/getTokenForUser";
import { TOGGLE_USER_VISIBILITY } from "./helpers/graphql/queries/user/toggleUserVisibility";

describe("User resolver", () => {
  afterAll(async () => {
    await clearDB();
  });

  it("create user", async () => {
    const res = await client.mutate({
      mutation: CREATE_USER,
      variables: {
        email: "test@test.com",
        password: "test",
        firstname: "testfirst",
        lastname: "testlast",
      },
      fetchPolicy: "no-cache",
    });

    expect(res.data?.createUser).toEqual({
      __typename: "User",
      email: "test@test.com",
    });
  });

  let token: string;
  let userId: number;

  it("gets token if user is valid", async () => {
    const res = await client.query({
      query: GET_TOKEN,
      variables: { password: "test", email: "test@test.com" },
      fetchPolicy: "no-cache",
    });
    expect(res.data?.getToken.token).toMatch(/^[\w-]*\.[\w-]*\.[\w-]*$/);
    token = res.data?.getToken.token;
    userId = res.data.getToken.userFromDB.userId;
  });

  it("query the connected user data with the token", async () => {
    const res = await client.query({
      query: GET_MY_USER_DATA,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: token,
        },
      },
    });
    expect(res.data?.getMyUserData).toEqual({
      email: "test@test.com",
      __typename: "User",
    });
  });

  it("toggle the user's visibility to become public", async () => {
    const testUserToken = await getTokenForUser("test", "test@test.com");

    // toggle default user visibility from private to public
    const res = await client.mutate({
      mutation: TOGGLE_USER_VISIBILITY,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: testUserToken,
        },
      },
    });
    expect(res.data?.toggleUserVisibility).toEqual("public");
  });

  it("query the user by ID", async () => {
    const res = await client.query({
      query: GET_USER_BY_ID,
      variables: { userId },
      fetchPolicy: "no-cache",
    });
    expect(res.data?.getUserById).toEqual({
      email: "test@test.com",
      __typename: "User",
    });
  });
});
