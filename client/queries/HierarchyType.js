import gql from 'graphql-tag';

export default gql`query {
    hierarchyType {
      id,
      description
    }
  }
`;