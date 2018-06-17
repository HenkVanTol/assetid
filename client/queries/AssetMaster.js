import gql from 'graphql-tag';

export default gql`
    query findAssetMasters($name:String, $description:String)
    {
        assetMaster (name: $name, description: $description) {
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