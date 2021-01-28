import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION: string = 'https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json';
const BASE_URL: string = 'https://api.stripe.com/';

export default class StripeHandler extends OpenAPIHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;
    config.baseUrl = BASE_URL;

    super({ name, config, cache});
  }
}
