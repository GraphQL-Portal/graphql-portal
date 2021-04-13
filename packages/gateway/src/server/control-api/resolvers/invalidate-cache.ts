import { config } from '@graphql-portal/config';
import { registerHandlers, spreadMessageToWorkers } from '../../../ipc/utils';
import { getApiMesh } from '../../router';

type Args = { apiDefName: string; cacheKey: string };

async function deleteCacheFromApi(name: string, key: string): Promise<boolean> {
  const mesh = getApiMesh(name);
  if (!mesh?.cache) return false;
  await mesh.cache.delete(key);
  return true;
}

export default async function invalidateCache(_: any, args: Args): Promise<boolean> {
  const apiDef = config.apiDefs.find((apiDef) => apiDef.name === args.apiDefName);
  if (!apiDef) return false;
  if (!apiDef.invalidate_cache_through_control_api) return false;

  spreadMessageToWorkers({ event: 'invalidateCache', data: args });
  return deleteCacheFromApi(args.apiDefName, args.cacheKey);
}

registerHandlers('invalidateCache', async ({ data: args }: { data: Args }) => {
  deleteCacheFromApi(args.apiDefName, args.cacheKey);
});
