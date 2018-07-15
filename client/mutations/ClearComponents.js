import gql from 'graphql-tag';

export default gql`
mutation setComponentMaster
(
  $masterId: Int
) 
  {
    clearComponents
    ( 
      masterId: $masterId
    ) 
      {
        id
      }
  }
`;