import { gql } from "@apollo/client/core";

export const CREATE_ACTIVITY_TYPE = gql`
    mutation CreateActivityType($data: CreateActivityTypeInput!) {
        createActivityType(data: $data) {
            name
            activityTypeId
        }
    }
`;
