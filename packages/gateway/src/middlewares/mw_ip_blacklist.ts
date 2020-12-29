import { ApiDef } from '@graphql-portal/types';
import { RequestMiddleware } from './index';
import { RequestHandler } from 'express';

export default class IpBlackListMW implements RequestMiddleware {
  processConfig(apiDef: ApiDef): void {
    apiDef.sources.forEach(source => {
      if (source.handler.graphql) {
        const graphql = source.handler.graphql;

        if (graphql.operationHeaders === undefined) {
          graphql.operationHeaders = {};
        }
        graphql.operationHeaders['x-text'] = '{context.x-test}';
      }
    });
  }

  getMiddleware(): RequestHandler {
    return function(req, res, next) {
      req.context.forwardHeaders['x-test'] = 'test';

      next();
    };
  }
}
