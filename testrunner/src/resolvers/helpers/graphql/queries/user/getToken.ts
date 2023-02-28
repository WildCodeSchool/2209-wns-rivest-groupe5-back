import { gql } from "@apollo/client/core";

export const GET_TOKEN = gql`
  query Query($password: String!, $email: String!) {
    getToken(password: $password, email: $email) {
      token
      userFromDB {
        userId
        email
        firstname
        lastname
      }
    }
  }
`;
