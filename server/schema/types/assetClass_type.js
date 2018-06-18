const graphql = require('graphql');

const {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType
} = graphql;

const AssetClassType = new GraphQLObjectType({
    name: 'AssetClassType',
    fields: {
        id: { type: GraphQLInt },
        description: { type: GraphQLString }
    }
});

module.exports = AssetClassType;