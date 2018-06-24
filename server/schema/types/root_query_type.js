const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat } = graphql;
const UserType = require('./user_type');
const AssetMasterType = require('./asset_master_type');
const AssetLookupType = require('./assetLookup_type');
const AssetMasterService = require('../../services/assetMaster');
const GraphQLDate = require('graphql-date');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      }
    },
    assetMaster: {
      type: new GraphQLList(AssetMasterType),
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return AssetMasterService.find(args.name, args.description);
      }
    },
    assetMasterById: {
      type: AssetMasterType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return AssetMasterService.findById(args.id);
      }
    },
    AssetLookups: {
      type: AssetLookupType,
      resolve(parentValue, args) {
        return [];
      }
    }
  }
});

module.exports = RootQueryType;
