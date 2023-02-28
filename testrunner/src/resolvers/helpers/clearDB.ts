import { gql } from "@apollo/client/core";
import client from "./getClient";

const DELETE_ALL_ENTITIES_MUTATION = gql`
  mutation DeleteAllEntities {
    deleteAllEntities
  }
`;

const clearDB = async () => {
  const deleteRes = await client.mutate({
    mutation: DELETE_ALL_ENTITIES_MUTATION,
  });

  console.log(deleteRes.data.deleteAllEntities);
};

export default clearDB;
