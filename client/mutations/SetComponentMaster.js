import gql from 'graphql-tag';

export default gql`
mutation setComponentMaster
(
  $componentId: Int,
  $masterId: Int
) 
  {
    setComponentMaster
    (
      componentId: $componentId, 
      masterId: $masterId
    ) 
      {
        id
      }
  }
`;