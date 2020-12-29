import { processConfig } from '@graphql-mesh/config';
import { getMesh } from '@graphql-mesh/runtime';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';
import { Application, Request, Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { loadCustomMiddlewares, RequestMiddleware } from '../middleware';
import ipBlackListMW from '../middleware/mw_ip_blacklist';

const logger = prefixLogger('router');

let router: Router;

export async function buildRouter(apiDefs: ApiDef[]): Promise<Router> {
  const nextRouter = Router();

  if (apiDefs?.length) {
    await Promise.all(
      apiDefs.map(async apiDef => {
        // prepare request context
        nextRouter.use(function(req, res, next) {
          req.context = {
            forwardHeaders: {},
          };

          next();
        });

        // apply built-in middleware (ip whitelist/blacklist, rate limiting, analytics, etc)
        nextRouter.use(apiDef.endpoint, ipBlackListMW(apiDef));

        // apply custom middleware
        const customMWs: RequestMiddleware[] = await loadCustomMiddlewares();
        customMWs.map(mw => {
          nextRouter.use(apiDef.endpoint, mw(apiDef));
        });

        const meshConfig = await processConfig({ sources: apiDef.sources });
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
              graphiql: true,
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
