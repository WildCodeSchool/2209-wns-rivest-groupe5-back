import { gql } from '@apollo/client/core'

export const CREATE_USER = gql`
  mutation Mutation($avatar: String!, $lastname: String!, $firstname: String!, $password: String!, $email: String!) {
  createUser(avatar: $avatar, lastname: $lastname, firstname: $firstname, password: $password, email: $email) {
    email
  }
}
`
