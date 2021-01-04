import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';
import { updateApi as updateApiInRouter } from '../../router';

const logger = prefixLogger('Query.updateApi');

export default async function updateApi(
  _: any,
  args: { name: string },
  { apiDefs }: { apiDefs: ApiDef[] }
): Promise<boolean> {
  const apiDef = apiDefs.find((apiDef) => apiDef.name === args.name);
  if (!apiDef) {
    logger.debug(`API to update was not found for name: ${args.name}`);
    return false;
  }

  logger.debug(`Updating API ${apiDef.name}: ${apiDef.endpoint}`);
  await updateApiInRouter(apiDef);
  return true;
}
