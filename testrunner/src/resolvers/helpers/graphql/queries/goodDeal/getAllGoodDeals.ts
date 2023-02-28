import { gql } from "@apollo/client/core";

export const GET_ALL_GOOD_DEALS = gql`
  query GetAllGoodDeals {
    getAllGoodDeals {
      goodDealId
      goodDealTitle
    }
  }
`;
