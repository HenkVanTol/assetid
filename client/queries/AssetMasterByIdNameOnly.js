import gql from 'graphql-tag';

export default gql`
    query findAssetMastersById($id:Int)
    {
        assetMasterById (id: $id) {
            name
        }
    }
`;