import { gql } from "@apollo/client";

// Query to get basic repo info (used on home page)
export const GET_REPO_INFO = gql`
  query GetRepositoryInfo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      nameWithOwner
      description
      stargazerCount
      forkCount
      pushedAt
      issues(states: [OPEN]) { # Get open issues
        totalCount
      }
      allIssues: issues { # Get all issues (for total count)
        totalCount
      }
      latestRelease { # Get the latest release
        id
        tagName
        publishedAt
      }
    }
  }
`;

// Query to fetch recent commits and their authors for the default branch
export const GET_REPOSITORY_COMMITS = gql`
  query GetRepositoryCommits($owner: String!, $name: String!, $limit: Int = 100) {
    repository(owner: $owner, name: $name) {
      id
      defaultBranchRef {
        name
        target {
          ... on Commit {
            id
            history(first: $limit) { # Fetch recent commits
              nodes {
                id
                committedDate
                messageHeadline
                author {
                  name
                  email
                  user { # Associated GitHub user (if available)
                    id
                    login
                    avatarUrl
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      }
    }
  }
`; 