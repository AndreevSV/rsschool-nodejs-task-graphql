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
    profile: {
      type: Profile,
      resolve: async (parent, _, { prisma }) => {
        return await prisma.profile.findUnique({
          where: { userId: parent.id },
          include: { memberType: true },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (parent, _, { prisma }) => {
        return await prisma.post.findMany({
          where: { authorId: parent.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (parent, _, { prisma }) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: parent.id },
          include: { author: true },
        });
        return subscriptions.map((subscription) => subscription.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (parent, _, { prisma }) => {
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: parent.id },
          include: { subscriber: true },
        });
        return subscribers.map((subscription) => subscription.subscriber);
      },
    },
  }),
});
