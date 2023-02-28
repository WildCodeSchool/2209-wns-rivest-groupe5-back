import { gql } from "@apollo/client/core";

export const GET_ALL_ACTIVITY_TYPES = gql`
  query GetAllActivityTypes {
    getAllActivityTypes {
      activityTypeId
      name
    }
  }
`;
