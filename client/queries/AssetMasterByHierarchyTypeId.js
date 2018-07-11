import gql from 'graphql-tag';

export default gql`
    query findAssetMastersByHierarchyTypeId($hierarchyTypeId:Int)
    {
        assetMasterByHierarchyTypeId (hierarchyTypeId: $hierarchyTypeId) {
            id,
            name
        }
    }
`;