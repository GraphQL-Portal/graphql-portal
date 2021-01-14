import { ApiDef } from '@graphql-portal/types';
import { Request, RequestHandler } from 'express';
import { prefixLogger } from '@graphql-portal/logger';

const prepareRequestContext: RequestHandler = function prepareRequestContext(req, res, next) {
  req.context = {
    forwardHeaders: {},
    requestId: req.id,
  };

  next();
};
export { prepareRequestContext };

const prepareForwardedHeaderLogger = prefixLogger('prepareForwardedHeader');

export function prepareForwardedHeader(header: string, apiDef: ApiDef): void {
  prepareForwardedHeaderLogger.info(header);
  apiDef.sources.forEach((source) => {
    if (source.handler.graphql) {
      const graphql = source.handler.graphql;

      if (graphql.operationHeaders === undefined) {
        graphql.operationHeaders = {};
      }
      graphql.operationHeaders[header] = `{context.${header}}`;
    }
  });
}

export function setForwardedHeader(req: Request, header: string, data: string): void {
  req.context.forwardHeaders[header] = data;
}
