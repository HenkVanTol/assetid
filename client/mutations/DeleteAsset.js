import gql from 'graphql-tag';

export default gql`
    mutation deleteAsset($id: Int) {
        deleteAsset(id: $id) {
            id
        }
    }
`;