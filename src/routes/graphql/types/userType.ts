import { UUIDType } from './uuid.js';
import { Profile } from './profileType.js';
import { Post } from './postType.js';
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} from 'graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: { type: Profile },
    posts: { type: new GraphQLNonNull(new GraphQLList(Post)) },
    userSubscribedTo: { type: new GraphQLNonNull(new GraphQLList(User)) },
    subscribedToUser: { type: new GraphQLNonNull(new GraphQLList(User)) },
  }),
});
