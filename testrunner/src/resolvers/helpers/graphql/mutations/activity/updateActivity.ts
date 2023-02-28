import { gql } from "@apollo/client/core";

export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($data: UpdateActivityInput!, $activityId: Float!) {
    updateActivity(data: $data, activityId: $activityId) {
      title
    }
  }
`;
