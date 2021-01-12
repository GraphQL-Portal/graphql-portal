import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';
import { registerHandlers, spreadMessageToWorkers } from '../../../ipc/utils';
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

  spreadMessageToWorkers({ event: 'updateApi', data: apiDef });
  return true;
}

let updating = false;
registerHandlers('updateApi', async ({ data: apiDef }: { data: ApiDef }) => {
  if (updating) return;
  updating = true;
  await updateApiInRouter(apiDef);
  updating = false;
});
