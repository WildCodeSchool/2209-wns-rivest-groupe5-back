import { gql } from '@apollo/client/core'

export const TOGGLE_USER_VISIBILITY = gql`
  mutation Mutation {
    toggleUserVisibility
  }
`
