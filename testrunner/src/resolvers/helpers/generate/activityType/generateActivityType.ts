import {
    activityTypeLabel,
    activityTypeName,
} from "src/interfaces/entitites/ActivityTypesTypesValues";
import { ITestActivityType } from "src/interfaces/entitites/testActivityTypeInterface";
import client from "../../getClient";
import { CREATE_ACTIVITY_TYPE } from "../../graphql/mutations/activityType/createActivityType";

export const generateTestActivityType = async (
    name: activityTypeName,
    label: activityTypeLabel,
    adminToken: string
): Promise<ITestActivityType> => {
    const res = await client.mutate({
        mutation: CREATE_ACTIVITY_TYPE,
        variables: {
            data: {
                activityTypeId: Math.floor(Math.random() * 1000),
                backgroundColor: "#ffffff",
                emoji: "x",
                label: label,
                name: name,
            },
        },
        fetchPolicy: "no-cache",
        context: {
            headers: {
                authorization: adminToken,
            },
        },
    });

    return res.data.createActivityType;
};
