import { diff } from '@graphql-inspector/core';
import { processConfig } from '@graphql-mesh/config';
import { getMesh } from '@graphql-mesh/runtime';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';
import { Application, Request, Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { defaultMiddlewares, loadCustomMiddlewares, prepareRequestContext } from '../middleware';

interface IMesh {
  schema: GraphQLSchema;
  contextBuilder: (initialContextValue?: any) => Promise<Record<string, any>>;
}

const logger = prefixLogger('router');

let router: Router;

export async function setRouter(app: Application, apiDefs: ApiDef[]): Promise<void> {
  await buildRouter(apiDefs);
  app.use((req, res, next) => router(req, res, next));
}

export async function buildRouter(apiDefs: ApiDef[]): Promise<Router> {
  const nextRouter = Router();

  nextRouter.use(prepareRequestContext);

  if (apiDefs?.length) {
    await Promise.all(apiDefs.map((apiDef) => buildApi(nextRouter, apiDef)));
  } else {
    logger.warn('No APIs were loaded. Probably, the configuration is empty?');
  }

  router = nextRouter;
  return router;
}

async function buildApi(toRouter: Router, apiDef: ApiDef, mesh?: IMesh) {
  if (!mesh) {
    const customMiddlewares = await loadCustomMiddlewares();
    [...defaultMiddlewares, ...customMiddlewares].map((mw) => {
      toRouter.use(apiDef.endpoint, mw(apiDef));
    });
  }

  const { schema, contextBuilder } = await getMeshForApiDef(apiDef, mesh);
  apiDef.schema = schema;

  logger.info(`Loaded API ${apiDef.name}: ${apiDef.endpoint}`);

  toRouter.use(
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
}

async function getMeshForApiDef(apiDef: ApiDef, mesh?: IMesh) {
  if (mesh) {
    return mesh;
  }
  const meshConfig = await processConfig({ sources: apiDef.sources, ...apiDef.mesh });
  return getMesh(meshConfig);
}

export async function updateApi(apiDef: ApiDef): Promise<void> {
  const mesh = await getMeshForApiDef(apiDef);
  if (!diff(mesh.schema, apiDef.schema!).length) {
    logger.debug(`API ${apiDef.name} schema was not changed`);
    return;
  }
  logger.info(`API ${apiDef.name} schema changed, updating: ${apiDef.endpoint}`);

  const routerWithNewApi = Router();
  await buildApi(routerWithNewApi, apiDef, mesh);

  const oldLayerIndex = router.stack.findIndex(
    (layer) => layer.name === 'graphqlMiddleware' && layer.regexp.test(apiDef.endpoint)
  );
  router.stack.splice(oldLayerIndex, 1, routerWithNewApi.stack[0]);
}
