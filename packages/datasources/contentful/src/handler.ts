import GraphQLHandler from '@graphql-mesh/graphql';
import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

export type Config = { token: string; space?: string; environment?: string; endpoint?: string };

export default class ContentfulHandler extends GraphQLHandler {
  public constructor({ name, config, cache, pubsub }: GetMeshSourceOptions<YamlConfig.GraphQLHandler & Config>) {
    config.schemaHeaders = config.operationHeaders = {
      authorization: `Bearer ${config.token}`,
    };
    if (!config.endpoint) {
      config.endpoint = `https://graphql.contentful.com/content/v1/spaces/${config.space}/environments/${
        config.environment || 'master'
      }`;
    }
    super({ name, config, cache, pubsub });
  }
}
