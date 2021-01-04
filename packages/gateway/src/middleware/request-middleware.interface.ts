import { ApiDef } from '@graphql-portal/types';
import { RequestHandler } from 'express';

export interface RequestMiddleware {
  (apiDef: ApiDef): RequestHandler;
}
