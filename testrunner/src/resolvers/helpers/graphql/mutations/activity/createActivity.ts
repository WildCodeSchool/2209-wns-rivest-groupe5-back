import { gql } from "@apollo/client/core";

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($data: CreateActivityInput!) {
    createActivity(data: $data) {
      activityId
      title
      carbonQuantity
      user {
        userId
        email
      }
      activityType {
        activityTypeId
        name
      }
    }
  }
`;
