import { ITestActivity } from "src/interfaces/entitites/testActivityInterface";
import client from "../../getClient";
import { CREATE_ACTIVITY } from "../../graphql/mutations/activity/createActivity";

export const generateTestActivity = async (
  activityTypeId: number,
  userToken: string
): Promise<ITestActivity> => {
  const res = await client.mutate({
    mutation: CREATE_ACTIVITY,
    variables: {
      data: {
        title: "test activity",
        activityTypeId,
        description: "This is a test activity",
        carbonQuantity: 10,
      },
    },
    fetchPolicy: "no-cache",
    context: {
      headers: {
        authorization: userToken,
      },
    },
  });

  return res.data.createActivity;
};
