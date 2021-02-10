import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION: string = 'https://app.swaggerhub.com/apiproxy/registry/Crunchbase/crunchbase-enterprise_api/1.0.3';
const BASE_URL: string = 'https://api.crunchbase.com/api/v4';

export default class CrunchbaseHandler extends OpenAPIHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;
    config.baseUrl = BASE_URL;
    super({ name, config, cache});
  }
}
