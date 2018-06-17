const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat
} = graphql;

const GraphQLDate = require('graphql-date');

const AssetMasterType = new GraphQLObjectType({
    name: 'AssetMasterType',
    fields: {
        id: { type: GraphQLInt },
        hierarchyTypeId: { type: GraphQLInt },
        masterId: { type: GraphQLInt },
        classId: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        serial: { type: GraphQLString },
        registration: { type: GraphQLString },
        acquisitionDate: { type: GraphQLDate },
        serviceDate: { type: GraphQLDate },
        retirementDate: { type: GraphQLDate },
        purchasePrice: { type: GraphQLFloat },
        purchaseOrderNumber: { type: GraphQLString },
        creatorId: { type: GraphQLInt },
    }
});

module.exports = AssetMasterType;