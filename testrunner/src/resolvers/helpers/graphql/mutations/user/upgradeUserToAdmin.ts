import { gql } from "@apollo/client/core";

export const UPGRADE_USER_TO_ADMIN = gql`
  mutation UpgradeUserToAdmin($email: String!) {
    upgradeUserToAdmin(email: $email)
  }
`;
