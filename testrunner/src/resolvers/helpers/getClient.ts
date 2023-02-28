import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import fetch from "cross-fetch";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://back:5050/",
    fetch,
  }),
  cache: new InMemoryCache(),
});

export default client;
