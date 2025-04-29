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
                    name
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

// Query to fetch issues created/closed recently for velocity calculation
export const GET_ISSUES_FOR_VELOCITY = gql`
  query GetIssuesForVelocity(
    $owner: String!
    $name: String!
    $since: DateTime!
    $first: Int = 100 # Adjust pagination as needed
    $cursor: String
  ) {
    repository(owner: $owner, name: $name) {
      id
      # Fetch issues created since the start date
      createdIssues: issues(
        first: $first
        after: $cursor
        filterBy: { since: $since }
        orderBy: { field: CREATED_AT, direction: ASC }
      ) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          createdAt
          closedAt
          state # To know if it was closed
        }
      }
      # Separate query for closed issues might be more efficient depending on API limits
      # But fetching all since a date and filtering might be simpler initially
    }
  }
`;

// Query to fetch recent releases for cadence calculation
export const GET_RELEASES = gql`
  query GetReleases(
    $owner: String!
    $name: String!
    $first: Int = 50 # Fetch last 50 releases initially
    $cursor: String
    $orderBy: ReleaseOrderField = CREATED_AT # Order by creation time
    $direction: OrderDirection = DESC
  ) {
    repository(owner: $owner, name: $name) {
      id
      releases(
        first: $first
        after: $cursor
        orderBy: { field: $orderBy, direction: $direction }
      ) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          tagName
          publishedAt
          isPrerelease
          isDraft
        }
      }
    }
  }
`; 