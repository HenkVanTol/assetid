const graphql = require('graphql');

const {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType
} = graphql;

const HierarchyTypeType = new GraphQLObjectType({
    name: 'HierarchyTypeType',
    fields: {
        id: { type: GraphQLInt },
        description: { type: GraphQLString }
    }
});

module.exports = HierarchyTypeType;