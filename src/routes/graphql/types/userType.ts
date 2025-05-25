import { UUIDType } from './uuid.js';
import { Profile } from './profileType.js';
import { Post } from './postType.js';
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat } from 'graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: Profile },
    posts: { type: new GraphQLList(Post) },
    userSubscribedTo: { type: new GraphQLList(User) },
    subscribedToUser: { type: new GraphQLList(User) },
  }),
});
