import gql from 'graphql-tag';

export default gql`
mutation updateAssetMaster
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
  $creatorId: Int,
  $id: Int
) 
  {
    updateAssetMaster
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
      creatorId: $creatorId,
      id: $id
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
        creatorId,
        id
      }
  }
`;