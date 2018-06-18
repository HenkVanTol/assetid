const graphql = require('graphql');
const HierarchyTypeType = require('./hierarchyType_type');
const AssetClassType = require('./assetClass_type');
const AssetMasterService = require('../../services/assetMaster');

const {
    GraphQLObjectType,
    GraphQLList
} = graphql;

const GraphQLDate = require('graphql-date');

const AssetLookupType = new GraphQLObjectType({
    name: 'AssetLookupType',
    fields: {
        HierarchyTypes: {
            type: new GraphQLList(HierarchyTypeType),
            resolve() {
                return AssetMasterService.hierarchyTypes();
            }
        },
        AssetClasses: {
            type: new GraphQLList(AssetClassType),
            resolve() {
                return AssetMasterService.assetClasses();
            }
        }
    }
});

module.exports = AssetLookupType;