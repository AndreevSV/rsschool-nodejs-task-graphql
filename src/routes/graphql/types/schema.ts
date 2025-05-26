import {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
} from 'graphql';
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
  ChangePostInput,
} from './inputTypes.js';

// ------------------- Query
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Member types query
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_, __, { prisma }) => await prisma.memberType.findMany(),
    },

    // Member type query
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_, { id }, { prisma }) => {
        const result = await prisma.memberType.findUnique({ where: { id } });
        return result;
      },
    },

    // Users query
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (_, __, { prisma }) =>
        await prisma.user.findMany({
          include: {
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        }),
    },

    // User query
    user: {
      type: User,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }) => {
        const user = await prisma.user.findUnique({
          where: { id },
          include: {
            userSubscribedTo: {
              include: {
                author: true,
              },
            },
            subscribedToUser: {
              include: {
                subscriber: true,
              },
            },
          },
        });
        return user;
      },
    },

    // Posts query
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (_, __, { prisma }) =>
        await prisma.post.findMany({
          include: {
            author: true,
          },
        }),
    },

    // Post query
    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }) =>
        await prisma.post.findUnique({
          where: { id },
          include: {
            author: true,
          },
        }),
    },

    // Profiles query
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      resolve: async (_, __, { prisma }) => await prisma.profile.findMany(),
    },

    // Profile query
    profile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, { prisma }) =>
        await prisma.profile.findUnique({
          where: { id },
          include: {
            memberType: true,
          },
        }),
    },
  },
});

// ------------------ Mutations
const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    // Create user mutation
    createUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, { dto }, { prisma }) => await prisma.user.create({ data: dto }),
    },
    // Create profile mutation
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_, { dto }, { prisma }) =>
        await prisma.profile.create({ data: dto }),
    },

    // Create Post mutation
    createPost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_, { dto }, { prisma }) => await prisma.post.create({ data: dto }),
    },

    // Change Post mutation
    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_, { id, dto }, { prisma }) =>
        await prisma.post.update({
          where: { id },
          data: dto,
        }),
    },

    // Change Profile mutation
    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_, { id, dto }, { prisma }) =>
        await prisma.profile.update({
          where: { id },
          data: dto,
        }),
    },

    // Change User mutation
    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_, { id, dto }, { prisma }) =>
        await prisma.user.update({
          where: { id },
          data: dto,
        }),
    },

    // Delete User mutation
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.user.delete({ where: { id } });
        return `Deletion of User with id ${id} was successful`;
      },
    },

    // Delete Post mutation
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.post.delete({ where: { id } });
        return `Deletion of Post with id ${id} was successful`;
      },
    },

    // Delete Profile mutation
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.profile.delete({ where: { id } });
        return `Deletion of Profile with id ${id} was successful`;
      },
    },

    // Subscrybe to Author mutation
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, { prisma }) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });
        return `Subscription to author with id ${authorId} was successful`;
      },
    },

    // Unsubscribe from Author mutation
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }, { prisma }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
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
  query: RootQueryType,
  mutation: Mutations,
});
