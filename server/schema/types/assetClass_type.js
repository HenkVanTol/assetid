const graphql = require('graphql');

const {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType
} = graphql;

const AssetClassType = new GraphQLObjectType({
    name: 'AssetClassType',
    fields: {
        classid: { type: GraphQLInt },
        description: { type: GraphQLString }
    }
});

module.exports = AssetClassType;