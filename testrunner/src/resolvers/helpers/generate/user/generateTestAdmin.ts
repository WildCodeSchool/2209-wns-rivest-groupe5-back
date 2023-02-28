import { ITestUser } from "src/interfaces/entitites/testUserInterface";
import client from "../../getClient";
import { CREATE_USER } from "../../graphql/mutations/user/createUser";
import { UPGRADE_USER_TO_ADMIN } from "../../graphql/mutations/user/upgradeUserToAdmin";

export const generateTestAdmin = async (): Promise<ITestUser> => {
  const userRes = await client.mutate({
    mutation: CREATE_USER,
    variables: {
      email: `admin${Math.floor(Math.random() * 1000000)}@test.com`,
      password: "test",
      firstname: "test",
      lastname: "admin",
    },
    fetchPolicy: "no-cache",
  });

  await client.mutate({
    mutation: UPGRADE_USER_TO_ADMIN,
    variables: {
      email: userRes.data.createUser.email,
    },
    fetchPolicy: "no-cache",
  });

  return userRes.data?.createUser;
};
