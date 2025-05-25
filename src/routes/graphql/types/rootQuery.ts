import { GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeId } from './memberType.js';
import { User } from './userType.js';
import { Post } from './postType.js';
import { Profile } from './profileType.js';
import { UUIDType } from './uuid.js';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_, __, { prisma }) => prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberTypeId },
      },
      resolve: (_, { id }, { prisma }) => prisma.memberType.findUnique({ where: { id } }),
    },
    users: { type: new GraphQLList(User) },
    user: { type: User, args: { id: { type: GraphQLString } } },
    posts: { type: new GraphQLList(Post) },
    post: { type: Post, args: { id: { type: GraphQLString } } },
    profiles: { type: new GraphQLList(Profile) },
    profile: { type: Profile, args: { id: { type: UUIDType } } },
  },
});
