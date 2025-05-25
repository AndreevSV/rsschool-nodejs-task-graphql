import {GraphQLFloat, GraphQLString, GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import {UUIDType} from './uuid.js';
import {Profile} from './profileType.js';

export const MemberTypeId = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        BASIC: {value: 'BASIC'},
        BUSINESS: {value: 'BUSINESS'},
    }
});

export const MemberType = new GraphQLObjectType({
    name: 'MemberType', 
    fields: () => ({
        id: {type: new GraphQLNonNull(MemberTypeId)},
        discount: {type: GraphQLFloat},
        postsLimitPerMonth: {type: GraphQLInt},
    }),
});

export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
    }),
});