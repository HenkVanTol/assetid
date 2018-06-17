import gql from 'graphql-tag';

export default gql`
mutation createAssetMaster($name:String, $description:String, $serial:String, 
  $registration:String, $acquisitionDate: Date, $retirementDate: Date, $hierarchyTypeId: Int) {
  createAssetMaster(name:$name, description:$description, serial:$serial, registration:$registration, 
    acquisitionDate: $acquisitionDate, retirementDate: $retirementDate, hierarchyTypeId: $hierarchyTypeId) {
      name, 
      description, 
      serial, 
      registration,
      acquisitionDate, 
      retirementDate,
      hierarchyTypeId
    }
  }
`;