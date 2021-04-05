import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
// eslint-disable-next-line @typescript-eslint/naming-convention
const GraphQLHandler = require('@graphql-mesh/graphql');

export type Config = { token: string; space?: string; environment?: string; endpoint?: string };

export default class ContentfulHandler extends GraphQLHandler {
  public constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.GraphQLHandler & Config>) {
    config.schemaHeaders = config.operationHeaders = {
      authorization: `Bearer ${config.token}`,
    };
    if (!config.endpoint) {
      config.endpoint = `https://graphql.contentful.com/content/v1/spaces/${
        config.space
      }/environments/${config.environment || 'master'}`;
    }
    super({ name, config, cache });
  }
}
