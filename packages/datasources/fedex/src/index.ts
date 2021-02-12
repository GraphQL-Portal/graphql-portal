import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION: string =
  'https://app.swaggerhub.com/apiproxy/registry/crossbordertrade/fedex_rest_api/1.0.0';
const BASE_URL: string = 'https://api.crossborder.fedex.com';

export default class FedexHandler extends OpenAPIHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;
    config.baseUrl = BASE_URL;
    super({ name, config, cache });
  }
}
