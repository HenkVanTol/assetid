import gql from 'graphql-tag';

export default gql`
mutation createAssetMaster
(
  $hierarchyTypeId: Int,
  $masterId: Int, 
  $classId: Int, 
  $name: String, 
  $description: String, 
  $serial: String, 
  $registration: String, 
  $acquisitionDate: Date,
  $serviceDate: Date,  
  $retirementDate: Date,
  $purchasePrice: Float,
  $purchaseOrderNumber: String, 
  $creatorId: Int
) 
  {
    createAssetMaster
    (
      hierarchyTypeId: $hierarchyTypeId, 
      masterId: $masterId, 
      classId: $classId, 
      name: $name, 
      description: $description, 
      serial: $serial, 
      registration: $registration, 
      acquisitionDate: $acquisitionDate, 
      serviceDate: $serviceDate, 
      retirementDate: $retirementDate, 
      purchasePrice: $purchasePrice, 
      purchaseOrderNumber: $purchaseOrderNumber, 
      creatorId: $creatorId
    ) 
      {
        hierarchyTypeId, 
        masterId, 
        classId, 
        name, 
        description, 
        serial, 
        registration, 
        acquisitionDate, 
        serviceDate, 
        retirementDate, 
        purchasePrice, 
        purchaseOrderNumber, 
        creatorId
      }
  }
`;