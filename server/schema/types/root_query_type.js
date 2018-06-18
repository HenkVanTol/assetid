const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat } = graphql;
const UserType = require('./user_type');
const InvoiceSearchType = require('./invoiceSearch_type');
const AssetMasterType = require('./asset_master_type');
const InvoiceStatusesType = require('./invoiceStatuses_type');
const ContractsType = require('./contracts_type');
const InvoiceLookupType = require('./invoiceLookup_type');
const AssetLookupType = require('./assetLookup_type');
const HierarchyTypeType = require('./hierarchyType_type');
const InvoiceService = require('../../services/invoice');
const LookupService = require('../../services/lookup');
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
    hierarchyType: {
      type: new GraphQLList(HierarchyTypeType),
      resolve() {
        return LookupService.getAll();
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
    InvoiceSearch: {
      type: new GraphQLList(InvoiceSearchType),
      args: {
        InvoiceNumber: { type: GraphQLString },
        StatusID: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return InvoiceService.InvoiceSearch(args.InvoiceNumber, args.StatusID);
      }
    },
    InvoiceByID: {
      type: new GraphQLList(InvoiceSearchType),
      args: {
        InvoiceID: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return InvoiceService.InvoiceByID(args.InvoiceID);
      }
    },
    InvoiceStatuses: {
      type: new GraphQLList(InvoiceStatusesType),
      resolve() {
        return InvoiceService.InvoiceStatuses();
      }
    },
    InvoiceLookups: {
      type: InvoiceLookupType,
      resolve(parentValue, args) {
        return [];
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
