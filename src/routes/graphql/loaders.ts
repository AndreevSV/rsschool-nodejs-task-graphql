import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { GraphQLResolveInfo } from 'graphql';

export const createLoaders = (prisma: PrismaClient) => {
  // User loader
  const userLoader = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: [...userIds],
        },
      },
    });
    return userIds.map((id) => users.find((user) => user.id === id) || null);
  });

  // Profile loader
  const profileByUserIdLoader = new DataLoader(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          in: [...userIds],
        },
      },
      include: { memberType: true },
    });
    return userIds.map(
      (userId) => profiles.find((profile) => profile.userId === userId) || null,
    );
  });

  // Posts by author loader
  const postsByAuthorIdLoader = new DataLoader(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [...authorIds],
        },
      },
    });

    return authorIds.map((authorId) =>
      posts.filter((post) => post.authorId === authorId),
    );
  });

  // User subscribed to loader
  const userSubscribedToLoader = new DataLoader(
    async (subscriberIds: readonly string[]) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: {
          subscriberId: {
            in: [...subscriberIds],
          },
        },
        include: {
          author: true,
        },
      });

      return subscriberIds.map((subscriberId) =>
        subscriptions
          .filter((sub) => sub.subscriberId === subscriberId)
          .map((sub) => sub.author),
      );
    },
  );

  // Subscribed to user loader
  const subscribedToUserLoader = new DataLoader(async (authorIds: readonly string[]) => {
    const subscribers = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: {
          in: [...authorIds],
        },
      },
      include: {
        subscriber: true,
      },
    });
    return authorIds.map((authorId) =>
      subscribers.filter((sub) => sub.authorId === authorId).map((sub) => sub.subscriber),
    );
  });

  // Member type loader
  const memberTypeLoader = new DataLoader(async (memberTypeIds: readonly string[]) => {
    const validIds = memberTypeIds.filter((id): id is string => id != null);

    if (validIds.length === 0) {
      return memberTypeIds.map(() => null);
    }

    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: { in: validIds },
      },
    });

    return memberTypeIds.map((id) =>
      id ? memberTypes.find((mt) => mt.id === id) || null : null,
    );
  });

  // Prime loaders with data
  const primeLoaders = (data: any | any[]): void => {
    if (!data) return;

    const items = Array.isArray(data) ? data : [data];

    items.forEach((item) => {
      if (!item) return;

      if (item.id) {
        userLoader.prime(item.id, item);
      }

      if (item.userId && item.memberType) {
        profileByUserIdLoader.prime(item.userId, item);
      }
    });
  };

  // Check if a field was requested in the GraphQL query
  const fieldRequested = (info: GraphQLResolveInfo, fieldName: string): boolean => {
    try {
      const parsedInfo = parseResolveInfo(info);
      if (!parsedInfo) return false;

      const fields = (parsedInfo as any).fieldsByTypeName[info.parentType.name] || {};
      const field = fields[fieldName];

      if (field) return true;

      const fragments = (parsedInfo as any).fragments || {};
      for (const fragment of Object.values(fragments)) {
        const fragmentFields = (fragment as any).fieldsByType?.[info.parentType.name];
        if (fragmentFields?.[fieldName]) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error in fieldRequested:', error);
      return false;
    }
  };

  return {
    userLoader,
    profileByUserIdLoader,
    postsByAuthorIdLoader,
    userSubscribedToLoader,
    subscribedToUserLoader,
    memberTypeLoader,
    primeLoaders,
    fieldRequested,
  };
};

export type DataLoaders = ReturnType<typeof createLoaders>;
