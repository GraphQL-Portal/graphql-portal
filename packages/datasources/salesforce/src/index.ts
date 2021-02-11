import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION: string =
  'http://resources.docs.salesforce.com/rel1/doc/en-us/static/misc/iot-connect-api-swagger-44.0.yaml';

export default class SalesforceHandler extends OpenAPIHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;
    super({ name, config, cache });
  }
}
