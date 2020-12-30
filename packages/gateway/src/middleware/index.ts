import { ApiDef } from '@graphql-portal/types';
import { RequestHandler } from 'express';
import { config } from '@graphql-portal/config';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import path from 'path';
import { promises as fs } from 'fs';
import { logger } from '@graphql-portal/logger';

export interface RequestMiddleware {
  (apiDef: ApiDef): RequestHandler;
}

export function prepareForwardedHeader(header: string, apiDef: ApiDef): void {
  logger.info('prepareForwardedHeader %s', header);
  apiDef.sources.forEach(source => {
    if (source.handler.graphql) {
      const graphql = source.handler.graphql;

      if (graphql.operationHeaders === undefined) {
        graphql.operationHeaders = {};
      }
      graphql.operationHeaders[header] = `{context.${header}}`;
    }
  });
}

export async function loadCustomMiddlewares(): Promise<RequestMiddleware[]> {
  if (config.gateway.middleware_path === '') {
    return [];
  }

  const workspaceRoot: string =
    findWorkspaceRoot(process.cwd()) === null ? process.cwd() : (findWorkspaceRoot(process.cwd()) as string);
  const mwDirPath: string = path.join(workspaceRoot, config.gateway.middleware_path);

  const mwFileNames = await fs.readdir(mwDirPath);
  return await Promise.all(
    mwFileNames
      .filter(name => /.js$/.test(name))
      .map(async name => {
        const mwPath = path.join(mwDirPath, name);
        const mw = await import(mwPath);
        return mw.default;
      })
  );
}
