import { GraphQLSchema } from 'graphql';
import { RootQuery } from './types/rootQuery.js';
import { Mutations } from './types/mutations.js';

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
