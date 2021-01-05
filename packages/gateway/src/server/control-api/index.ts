import { config } from '@graphql-portal/config';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { readFileSync } from 'fs';
import resolvers from './resolvers';

const logger = prefixLogger('control-api');

export default function setupControlApi(app: Express, apiDefs: ApiDef[]) {
  const { endpoint } = config.gateway?.control_api_config || {};
  if (!endpoint) {
    logger.warn('Control API will not run: endpoint is not specified!');
    return;
  }

  const schema = makeExecutableSchema({
    typeDefs: readFileSync(`${__dirname}/schema.gql`, 'utf8'),
    resolvers,
  });

  app.use(
    endpoint,
    graphqlHTTP({
      schema,
      context: {
        apiDefs,
      },
      graphiql: { headerEditorEnabled: true },
    })
  );

  logger.info(`Control API runs on endpoint: ${endpoint}`);
}
