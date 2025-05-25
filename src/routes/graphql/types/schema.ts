import { GraphQLList, GraphQLString, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberType, MemberTypeId } from './memberType.js';
import { User } from './userType.js';
import { Post } from './postType.js';
import { Profile } from './profileType.js';
import { UUIDType } from './uuid.js';
import {
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput,
  ChangeProfileInput,
  ChangeUserInput,
} from './inputTypes.js';

// Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Member types query
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: (_, __, { prisma }) => prisma.memberType.findMany(),
    },

    // Member type query
    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberTypeId },
      },
      resolve: (_, { id }, { prisma }) => prisma.memberType.findUnique({ where: { id } }),
    },

    // Users query
    users: {
      type: new GraphQLList(User),
      resolve: (_, __, { prisma }) => prisma.user.findMany(),
    },

    // User query
    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id } }),
    },

    // Posts query
    posts: {
      type: new GraphQLList(Post),
      resolve: (_, __, { prisma }) => prisma.post.findMany(),
    },

    // Post query
    post: {
      type: Post,
      args: { id: { type: GraphQLString } },
      resolve: (_, { id }, { prisma }) => prisma.post.findUnique({ where: { id } }),
    },

    // Profiles query
    profiles: {
      type: new GraphQLList(Profile),
      resolve: (_, __, { prisma }) => prisma.profile.findMany(),
    },

    // Profile query
    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: (_, { id }, { prisma }) => prisma.profile.findUnique({ where: { id } }),
    },
  },
});

//Mutations
const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    // Create user mutation
    createUser: {
      type: User,
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: (_, { dto }, { prisma }) => prisma.user.create({ data: dto }),
    },
    // Create profile mutation
    createProfile: {
      type: Profile,
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: (_, { dto }, { prisma }) => prisma.profile.create({ data: dto }),
    },

    // Create Post mutation
    createPost: {
      type: Post,
      args: {
        dto: { type: CreatePostInput },
      },
      resolve: (_, { dto }, { prisma }) => prisma.post.create({ data: dto }),
    },

    // Change Profile mutation
    changeProfile: {
      type: Profile,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeProfileInput },
      },
      resolve: (_, { id, dto }, { prisma }) =>
        prisma.profile.update({
          where: { id },
          data: dto,
        }),
    },

    // Change User mutation
    changeUser: {
      type: User,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeUserInput },
      },
      resolve: (_, { id, dto }, { prisma }) =>
        prisma.user.update({
          where: { id },
          data: dto,
        }),
    },

    // Delete User mutation
    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: UUIDType },
      },
      resolve: (_, { id }, { prisma }) =>
        prisma.user.delete({
          where: { id },
        }),
    },

    // Delete Post mutation
    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: UUIDType },
      },
      resolve: (_, { id }, { prisma }) => {
        prisma.post.delete({ where: { id } });
        return `Deletion of User with id ${id} was successful`;
      },
    },

    // Delete Profile mutation
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: UUIDType },
      },
      resolve: (_, { id }, { prisma }) => {
        prisma.profile.delete({ where: { id } });
        return `Deletion of Profile with id ${id} was successful`;
      },
    },

    // Subscrybe to Author mutation
    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: (_, { userId, authorId }, { prisma }) => {
        prisma.subscribersOnAuthors.create({
          data: {
            subscribverId: userId,
            authorId,
          },
        });
        return `Subscription to author with id ${authorId} was successful`;
      },
    },

    // Unsubscribe from Author mutation
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: (_, { userId, authorId }, { prisma }) => {
        prisma.subscribersOnAuthors.delete({
          where: {
            subsciberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });
        return `Subscription on author with id ${authorId} was removed successful`;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
