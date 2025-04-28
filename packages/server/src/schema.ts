import gql from 'graphql-tag';

// Using gql tag for syntax highlighting and potential tooling benefits
export const typeDefs = gql`
  type Query {
    """
    A simple query to check if the server is running.
    """
    _ping: String!
  }
`; 