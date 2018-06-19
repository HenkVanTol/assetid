const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLFloat
} = graphql;

const UserType = require('./types/user_type');
const InvoiceSearchType = require('./types/invoiceSearch_type');
const AssetMasterType = require('./types/asset_master_type');
const AuthService = require('../services/auth');
const InvoiceService = require('../services/invoice');
const AssetMasterService = require('../services/assetMaster');
const GraphQLDate = require('graphql-date');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) { //request is request object from express
                return AuthService.signup({ email, password, req });
            }
        },
        logout: {
            type: UserType,
            resolve(parentValue, args, req) {
                const { user } = req;
                req.logout();
                return user;
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) {
                return AuthService.login({ email, password, req });
            }
        },
        CreateInvoice: {
            type: InvoiceSearchType,
            args: {
                InvoiceNumber: { type: GraphQLString },
                ContractID: { type: GraphQLInt },
                StatusID: { type: GraphQLInt },
                DateRaised: { type: GraphQLDate },
                Value: { type: GraphQLFloat }
            },
            resolve(parentValue, { InvoiceNumber, ContractID, StatusID, DateRaised, Value }) {
                return InvoiceService.CreateInvoice({ InvoiceNumber, ContractID, StatusID, DateRaised, Value });
            }
        },
        UpdateInvoice: {
            type: InvoiceSearchType,
            args: {
                InvoiceID: { type: GraphQLInt },
                InvoiceNumber: { type: GraphQLString },
                ContractID: { type: GraphQLInt },
                StatusID: { type: GraphQLInt },
                DateRaised: { type: GraphQLDate },
                Value: { type: GraphQLFloat }
            },
            resolve(parentValue, { InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value }) {
                return InvoiceService.UpdateInvoice({ InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value });
            }
        },
        createAssetMaster: {
            type: AssetMasterType,
            args: {
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
                creatorId: { type: GraphQLInt }
            },
            resolve(parentValue, 
                { 
                    hierarchyTypeId,
                    masterId,
                    classId,
                    name, 
                    description, 
                    serial, 
                    registration, 
                    acquisitionDate, 
                    serviceDate, 
                    retirementDate, 
                    purchasePrice,
                    purchaseOrderNumber,
                    creatorId
                }) {
                return AssetMasterService.create(
                    { 
                        hierarchyTypeId,
                        masterId,
                        classId,
                        name, 
                        description, 
                        serial, 
                        registration, 
                        acquisitionDate, 
                        serviceDate,  
                        retirementDate, 
                        purchasePrice,
                        purchaseOrderNumber,
                        creatorId
                    }
                );
            }
        },
        updateAssetMaster: {
            type: AssetMasterType,
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                serial: { type: GraphQLString },
                registration: { type: GraphQLString },
                acquisitionDate: { type: GraphQLDate },
                retirementDate: { type: GraphQLDate },
                hierarchyTypeId: { type: GraphQLInt }
            },
            resolve(parentValue, { id, name, description, serial, registration, acquisitionDate, retirementDate, hierarchyTypeId }) {
                return AssetMasterService.update({ id, name, description, serial, registration, acquisitionDate, retirementDate, hierarchyTypeId });
            }
        }
    }
});

module.exports = mutation;