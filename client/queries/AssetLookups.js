import gql from 'graphql-tag';

export default gql`query {
  AssetLookups {
    HierarchyTypes {
      id
      description
    }
    AssetClasses {
      classid
      description
    }
  }
}
`;