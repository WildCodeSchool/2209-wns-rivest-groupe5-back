import { gql } from "@apollo/client/core";
import client from "../../getClient";

export const getTokenForUser = async (
  password: string,
  email: string
): Promise<string> => {
  const res = await client.query({
    query: gql`
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
    `,
    variables: { password, email },
    fetchPolicy: "no-cache",
  });

  return res.data.getToken.token;
};
