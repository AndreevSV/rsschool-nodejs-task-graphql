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

    users: {
      type: new GraphQLList(User),
      resolve: (_, __, { prisma }) => prisma.user.findMany(),
    },

    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id } }),
    },

    posts: {
      type: new GraphQLList(Post),
      resolve: (_, __, { prisma }) => prisma.post.findMany(),
    },

    post: {
      type: Post,
      args: { id: { type: GraphQLString } },
      resolve: (_, { id }, { prisma }) => prisma.post.findUnique({ where: { id } }),
    },

    profiles: {
      type: new GraphQLList(Profile),
      resolve: (_, __, { prisma }) => prisma.profile.findMany(),
    },

    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: (_, { id }, { prisma }) => prisma.profile.findUnique({ where: { id } }),
    },
  },
});
