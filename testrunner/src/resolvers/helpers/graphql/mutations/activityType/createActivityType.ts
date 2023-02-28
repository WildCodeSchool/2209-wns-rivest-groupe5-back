import { gql } from "@apollo/client/core";

export const CREATE_ACTIVITY_TYPE = gql`
  mutation CreateActivityType($name: String!) {
    createActivityType(name: $name) {
      name
      activityTypeId
    }
  }
`;
