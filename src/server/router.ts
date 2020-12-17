import { processConfig } from '@graphql-mesh/config';
import { getMesh } from '@graphql-mesh/runtime';
import { Application, Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';

const logger = prefixLogger('router');

let router: Router;

export async function buildRouter(apiDefs: ApiDef[]): Promise<Router> {
  const nextRouter = Router();

  if (apiDefs?.length) {
    await Promise.all(
      apiDefs.map(async (api) => {
        const meshConfig = await processConfig({ sources: api.sources });
        const { schema, contextBuilder } = await getMesh(meshConfig);

        logger.info(`Loaded API ${api.name}: ${api.endpoint}`);
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
  } else {
    logger.info('No API loaded');
  }

  router = nextRouter;
  return router;
}

export async function setRouter(app: Application, apiDefs: ApiDef[]): Promise<void> {
  await buildRouter(apiDefs);
  app.use((req, res, next) => router(req, res, next));
}
