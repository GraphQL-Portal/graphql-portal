import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION: string = 'https://api.twitter.com/labs/2/openapi.json';
const BASE_URL: string = 'https://developer.twitter.com/"';

export default class TwitterHandler extends OpenAPIHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;
    config.baseUrl = BASE_URL;

    super({ name, config, cache});
  }
}
