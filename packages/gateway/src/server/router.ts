import { diff } from '@graphql-inspector/core';
import { processConfig } from '@graphql-mesh/config';
import { getMesh } from '@graphql-mesh/runtime';
import { MeshPubSub } from '@graphql-mesh/types';
import { config } from '@graphql-portal/config';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';
import { Application, Request, RequestHandler, Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { subscribeToRequestMetrics } from '../metric';
import { defaultMiddlewares, loadCustomMiddlewares, handleError, prepareRequestContext } from '../middleware';

interface IMesh {
  schema: GraphQLSchema;
  pubsub: MeshPubSub;
  contextBuilder: (initialContextValue?: any) => Promise<Record<string, any>>;
}

const logger = prefixLogger('router');

let router: Router;
export const apiSchema: { [apiName: string]: GraphQLSchema } = {};

export async function setRouter(app: Application, apiDefs: ApiDef[]): Promise<void> {
  await buildRouter(apiDefs);
  app.use((req, res, next) => router(req, res, next));
  app.use(handleError);
}

export async function buildRouter(apiDefs: ApiDef[]): Promise<Router> {
  const nextRouter = Router();

  nextRouter.use(prepareRequestContext);

  if (apiDefs?.length) {
    logger.info('Loaded %s API Definitions, preparing the endpoints for them.', apiDefs.length);
    await Promise.all(apiDefs.map((apiDef) => buildApi(nextRouter, apiDef)));
  } else {
    logger.warn('No APIs were loaded as the configuration is empty.');
  }

  router = nextRouter;
  return router;
}

async function buildApi(toRouter: Router, apiDef: ApiDef, mesh?: IMesh) {
  if (!mesh) {
    const customMiddlewares = await loadCustomMiddlewares();
    [...defaultMiddlewares, ...customMiddlewares].map((mw) => {
      const handler = mw(apiDef);
      function wrap(fn: RequestHandler): RequestHandler {
        return (req, res, next) => {
          const handleError = (error: Error) => {
            error.handlerName = handler.name;
            return next(error);
          };
          try {
            (fn(req, res, next) as any)?.catch(handleError);
          } catch (error) {
            handleError(error);
          }
        };
      }
      toRouter.use(apiDef.endpoint, wrap(handler));
    });
  }

  mesh = await getMeshForApiDef(apiDef, mesh);
  if (!mesh) {
    logger.error(`Could not get schema for API, enpoint ${apiDef.endpoint} won't be added to the router`);
    return;
  }
  const { schema, contextBuilder, pubsub } = mesh;
  apiSchema[apiDef.name] = schema;

  if (config.gateway?.metrics?.enabled) {
    await subscribeToRequestMetrics(pubsub);
  }

  logger.info(`Loaded API ${apiDef.name} ➜ ${apiDef.endpoint}`);

  toRouter.use(
    apiDef.endpoint,
    graphqlHTTP(async (req: Request) => {
      const context = await contextBuilder({
        forwardHeaders: req?.context?.forwardHeaders || {},
        requestId: req.id,
      });

      return {
        schema,
        context,
        graphiql: apiDef.playground ? { headerEditorEnabled: true } : false,
      };
    })
  );
}

async function getMeshForApiDef(apiDef: ApiDef, mesh?: IMesh, retry = 5): Promise<IMesh | undefined> {
  if (mesh) {
    return mesh;
  }
  try {
    const meshConfig = await processConfig({ sources: apiDef.sources, ...apiDef.mesh });
    mesh = await getMesh(meshConfig);
  } catch (error) {
    logger.error(error);
    if (retry) {
      logger.warn('Failed to load schema, retrying after 5 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return getMeshForApiDef(apiDef, mesh, retry - 1);
    }
  }
  return mesh;
}

/**
 * Rebuilds the Mesh for a give apiDef and updates the endpoint in the router
 * to point to a new Mesh instance.
 *
 * @param apiDef API Definition which should be updated
 */
export async function updateApi(apiDef: ApiDef): Promise<void> {
  logger.debug(`Updating API ${apiDef.name}: ${apiDef.endpoint}`);
  const mesh = await getMeshForApiDef(apiDef);
  if (!mesh) {
    logger.error(`Could not get schema for API, endpoint ${apiDef.endpoint} won't be updated in the router`);
    return;
  }
  if (apiSchema[apiDef.name] && !diff(mesh.schema, apiSchema[apiDef.name]!).length) {
    logger.debug(`API ${apiDef.name} schema was not changed`);
    return;
  }
  logger.info(`API ${apiDef.name} schema changed, updating the endpoint: ${apiDef.endpoint}`);

  const routerWithNewApi = Router();
  await buildApi(routerWithNewApi, apiDef, mesh);

  const oldLayerIndex = router.stack.findIndex(
    (layer) => layer.name === 'graphqlMiddleware' && layer.regexp.test(apiDef.endpoint)
  );
  router.stack.splice(oldLayerIndex, 1, routerWithNewApi.stack[0]);
}
