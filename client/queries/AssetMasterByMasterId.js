import gql from 'graphql-tag';

export default gql`
    query findAssetMastersByMasterId($masterId:Int)
    {
        assetMasterByMasterId (masterId: $masterId) {
            id,
            name,
            description,
            serial,
            registration,
            acquisitionDate,
            masterId
        }
    }
`;