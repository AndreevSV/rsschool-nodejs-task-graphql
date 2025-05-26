import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { schema } from './types/schema.js';
import { graphql, getIntrospectionQuery, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const MAX_DEPTH_GRAPHQL_QUERY = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const documentAST = parse(query);

      const validationErrors = validate(schema, documentAST, [
        depthLimit(MAX_DEPTH_GRAPHQL_QUERY),
      ]);

      if (validationErrors.length > 0) {
        return {
          errors: validationErrors,
          data: null,
        };
      }
      if (query === getIntrospectionQuery()) {
        return graphql({
          schema,
          source: query,
          variableValues: variables,
        });
      }

      return graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
