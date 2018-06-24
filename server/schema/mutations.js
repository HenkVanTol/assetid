const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLFloat
} = graphql;

const UserType = require('./types/user_type');
const AssetMasterType = require('./types/asset_master_type');
const AuthService = require('../services/auth');
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
                id: { type: GraphQLInt }
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
                    creatorId,
                    id
                }) {
                return AssetMasterService.update(
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
                        creatorId,
                        id
                    }
                );
            }
        }
    }
});

module.exports = mutation;