import { gql } from "@apollo/client/core";

export const GET_MY_USER_DATA = gql`
  query Query {
    getMyUserData {
      email
    }
  }
`;
