import { gql } from "@apollo/client";

export const USER_REPOSITORIES = gql`
  query Get_User_Repositories($login: String!, $first: Int, $after: String) {
    user(login: $login) {
      repositories(first: $first, after: $after) {
        nodes {
          id
          name
          stargazerCount
          forkCount
          url
        }
        pageInfo {
          endCursor
        }
        totalCount
      }
    }
  }
`;
