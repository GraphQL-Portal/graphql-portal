import OpenAPIHandler from '@graphql-mesh/openapi';
import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

const BASE_URL = 'https://api.twitter.com/2';

export default class TwitterHandler extends OpenAPIHandler {
  public constructor({
    name,
    config,
    cache,
    pubsub,
  }: GetMeshSourceOptions<YamlConfig.OpenapiHandler & { token: string }>) {
    config.source = require.resolve('@graphql-portal/twitter/src/source.json');
    config.baseUrl = BASE_URL;
    config.operationHeaders = config.schemaHeaders = {
      authorization: `Bearer ${config.token}`,
    };

    super({ name, config, cache, pubsub });
  }
}
