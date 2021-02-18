import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
// eslint-disable-next-line @typescript-eslint/naming-convention
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION = 'https://api.twitter.com/labs/2/openapi.json';
const BASE_URL = 'https://developer.twitter.com/"';

export default class TwitterHandler extends OpenAPIHandler {
  public constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;
    config.baseUrl = BASE_URL;

    super({ name, config, cache });
  }
}
