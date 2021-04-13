import OpenAPIHandler from '@graphql-mesh/openapi';
import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

const BASE_URL = 'http://ip-api.com';

export default class IPAPIHandler extends OpenAPIHandler {
  public constructor({ name, config, cache, pubsub }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = require.resolve('@graphql-portal/ip-api/src/source.json');
    config.baseUrl = BASE_URL;

    super({ name, config, cache, pubsub });
  }
}
