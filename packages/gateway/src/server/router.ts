import { processConfig } from '@graphql-mesh/config';
import { getMesh } from '@graphql-mesh/runtime';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';
import { Application, Request, Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { prepareRequestContext } from '../middleware';
import { defaultMiddlewares, loadCustomMiddlewares } from '../middleware';

const logger = prefixLogger('router');

let router: Router;

export async function buildRouter(apiDefs: ApiDef[]): Promise<Router> {
  const nextRouter = Router();

  if (apiDefs?.length) {
    await Promise.all(
      apiDefs.map(async (apiDef) => {
        nextRouter.use(prepareRequestContext);
        const customMiddlewares = await loadCustomMiddlewares();
        [...defaultMiddlewares, ...customMiddlewares].map((mw) => {
          nextRouter.use(apiDef.endpoint, mw(apiDef));
        });

        const meshConfig = await processConfig({ sources: apiDef.sources, ...apiDef.mesh });
        const { schema, contextBuilder } = await getMesh(meshConfig);

        logger.info(`Loaded API ${apiDef.name}: ${apiDef.endpoint}`);

        // mesh middleware
        nextRouter.use(
          apiDef.endpoint,
          graphqlHTTP(async (req: Request) => {
            const forwardHeaders = req.context === undefined ? {} : req.context.forwardHeaders;
            const context = await contextBuilder({
              ...forwardHeaders,
            });

            return {
              schema,
              context,
              graphiql: { headerEditorEnabled: true },
            };
          })
        );
      })
    );
  } else {
    logger.warn('No APIs loaded. Configuration is empty?');
  }

  router = nextRouter;
  return router;
}

export async function setRouter(app: Application, apiDefs: ApiDef[]): Promise<void> {
  await buildRouter(apiDefs);
  app.use((req, res, next) => router(req, res, next));
}
