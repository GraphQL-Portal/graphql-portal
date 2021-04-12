import { config } from '@graphql-portal/config';
import { prefixLogger } from '@graphql-portal/logger';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { readFileSync } from 'fs';
import resolvers from './resolvers';
import path from 'path';

const logger = prefixLogger('control-api');

export default function setupControlApi(app: Express): void {
  if (!config.gateway.enable_control_api) {
    logger.info('Control API is disabled.');
    return;
  }

  const { endpoint } = config.gateway?.control_api_config || {};
  if (!endpoint) {
    logger.warn('Control API will not run: endpoint is not specified!');
    return;
  }

  const schema = makeExecutableSchema({
    typeDefs: readFileSync(path.join(__dirname, 'schema.gql'), 'utf8'),
    resolvers,
  });

  app.use(
    endpoint,
    graphqlHTTP({
      schema,
      graphiql: { headerEditorEnabled: true },
    })
  );

  logger.info(`Control API runs on endpoint: ${endpoint}`);
}
