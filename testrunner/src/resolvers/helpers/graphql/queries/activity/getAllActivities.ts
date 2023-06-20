import { gql } from '@apollo/client/core'

export const GET_ALL_ACTIVITIES = gql`
  query GetAllActivities {
    getAllActivities {
      data {
        title
        activityId
      }
    }
  }
`
