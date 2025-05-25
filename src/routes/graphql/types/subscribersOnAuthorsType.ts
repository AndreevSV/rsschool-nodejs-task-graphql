import {GraphQLObjectType} from 'graphql';
import {User} from './userType.js';
import {UUIDType} from './uuid.js';

export const SubscribersOnAuthors = new GraphQLObjectType({
    name: 'SubscribersOnAuthors',
    fields: () => ({
        subscriber: { type: User },
        subscriberId: { type: UUIDType },
        author: { type: User },
        authorId: { type: UUIDType },
    })

});
