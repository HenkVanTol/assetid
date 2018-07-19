import gql from 'graphql-tag';

export default gql`
    query findAssetMasters($name:String, $description:String, $classId: Int, $serial: String)
    {
        assetMaster (name: $name, description: $description, classId: $classId, serial: $serial) {
            id,
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