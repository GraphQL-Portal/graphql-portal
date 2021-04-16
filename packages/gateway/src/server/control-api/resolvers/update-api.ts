import { config } from '@graphql-portal/config';

export default async function updateApi(_: any, args: { name: string }): Promise<boolean> {
  const apiDef = config.apiDefs.find((apiDef) => apiDef.name === args.name);
  if (!apiDef) return false;
  if (!apiDef.schema_updates_through_control_api) return false;

  // spreadMessageToWorkers({ event: 'updateApi', data: apiDef });
  return true;
}

// let updating = false;
// registerHandlers('updateApi', async ({ data: apiDef }: { data: ApiDef }) => {
//   if (updating) return;
//   updating = true;
//   await updateApiInRouter(apiDef);
//   updating = false;
// });
