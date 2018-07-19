import gql from 'graphql-tag';

export default gql`query {
  AssetLookups {
    AssetClasses {
      classid
      description
    }
  }
}
`;