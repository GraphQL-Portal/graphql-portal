import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

// eslint-disable-next-line @typescript-eslint/naming-convention
const GraphQLHandler = require('@graphql-mesh/graphql');

export default class ContentfulHandler extends GraphQLHandler {
  public constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.GraphQLHandler & { token: string }>) {
    config.schemaHeaders = { authorization: `Bearer ${config.token}` };
    config.operationHeaders = { authorization: `Bearer ${config.token}` };
    super({ name, config, cache });
  }
}
