import { gql } from '@apollo/client';

export const GET_REPOSITORY_INFO = gql`
  query GetRepositoryInfo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      description
      url
      stargazerCount
      forkCount
      openIssues: issues(states: OPEN) {
        totalCount
      }
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 1) {
              totalCount # Represents total commits on default branch
            }
          }
        }
      }
    }
  }
`; 