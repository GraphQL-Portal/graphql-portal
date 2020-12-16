import { processConfig } from '@graphql-mesh/config';
import { getMesh } from '@graphql-mesh/runtime';
import { Application, Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { prefixLogger } from '../logger';
import { Api } from '../types/api.interface';

const logger = prefixLogger('router');

let router: Router;

export async function buildRouter(apis: Api[]): Promise<Router> {
  const nextRouter = Router();

  await Promise.all(
    apis.map(async (api) => {
      const meshConfig = await processConfig({ sources: api.sources });
      const { schema, contextBuilder } = await getMesh(meshConfig);

      logger.info(`Loaded API: ${api.endpoint}`);
      nextRouter.use(
        api.endpoint,
        graphqlHTTP(async (req) => ({
          schema,
          context: await contextBuilder(req),
          graphiql: true,
        }))
      );
    })
  );

  router = nextRouter;
  return router;
}

export async function setRouter(app: Application, apis: Api[]): Promise<void> {
  await buildRouter(apis);
  app.use((req, res, next) => router(req, res, next));
}
