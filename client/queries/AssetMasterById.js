import gql from 'graphql-tag';

export default gql`
    query findAssetMastersById($id:Int)
    {
        assetMasterById (id: $id) {
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