import { ApiDef } from '@graphql-portal/types';
import { RequestHandler } from 'express';
import { config } from '@graphql-portal/config';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import path from 'path';
import { readdir } from 'fs/promises';

export interface RequestMiddleware {
  processConfig(apiDef: ApiDef): void;
  getMiddleware(): RequestHandler;
}

export async function loadCustomMiddlewares(): Promise<RequestMiddleware[]> {
  if (config.gateway.middleware_path === '') {
    return [];
  }

  const workspaceRoot: string =
    findWorkspaceRoot(process.cwd()) === null ? process.cwd() : (findWorkspaceRoot(process.cwd()) as string);
  const mwDirPath: string = path.join(workspaceRoot, config.gateway.middleware_path);

  const mwFileNames = await readdir(mwDirPath);
  return await Promise.all(
    mwFileNames
      .filter(name => /.js$/.test(name))
      .map(async name => {
        const mwPath = path.join(mwDirPath, name);
        const mw = await import(mwPath);
        if (mw.default) {
          return new mw.default();
        }
      })
  );
}
