import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
// eslint-disable-next-line @typescript-eslint/naming-convention
const OpenAPIHandler = require('@graphql-mesh/openapi');

const BASE_URL = 'https://api.twitter.com/2';

export default class TwitterHandler extends OpenAPIHandler {
  public constructor({
    name,
    config,
    cache,
  }: GetMeshSourceOptions<YamlConfig.OpenapiHandler & { authorization: string }>) {
    config.source = require.resolve('@graphql-portal/twitter/src/source.json');
    config.baseUrl = BASE_URL;
    config.operationHeaders = config.schemaHeaders = {
      authorization: config.authorization,
    };

    super({ name, config, cache });
  }
}
