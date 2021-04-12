import { config } from '@graphql-portal/config';
import { ApiDef } from '@graphql-portal/types';
import { registerHandlers, spreadMessageToWorkers } from '../../../ipc/utils';
import { updateApi as updateApiInRouter } from '../../router';

export default async function updateApi(_: any, args: { name: string }): Promise<boolean> {
  const apiDef = config.apiDefs.find((apiDef) => apiDef.name === args.name);
  if (!apiDef) return false;
  if (!apiDef.schema_updates_through_control_api) return false;

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
