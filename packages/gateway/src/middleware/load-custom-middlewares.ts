import { config } from '@graphql-portal/config';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import path from 'path';
import { promises as fs } from 'fs';
import { RequestMiddleware } from '.';

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
      .filter((name) => /.js$/.test(name))
      .map(async (name) => {
        const mwPath = path.join(mwDirPath, name);
        const mw = await import(mwPath);
        return mw.default;
      })
  );
}
