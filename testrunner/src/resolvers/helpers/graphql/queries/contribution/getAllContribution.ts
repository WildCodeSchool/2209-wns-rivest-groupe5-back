import { gql } from "@apollo/client/core";

export const GET_ALL_CONTRIBUTION = gql`
  query Query {
    getAllContributions {
      contributionId
      amount
    }
  }
`;
