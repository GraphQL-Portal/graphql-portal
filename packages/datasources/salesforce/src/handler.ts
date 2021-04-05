import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

// eslint-disable-next-line @typescript-eslint/naming-convention
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION =
  'http://resources.docs.salesforce.com/rel1/doc/en-us/static/misc/iot-connect-api-swagger-45.0.yaml';

export default class SalesforceHandler extends OpenAPIHandler {
  public constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler & { token?: string }>) {
    config.source = OPENAPI_SPECIFICATION;
    if (config.token) {
      config.schemaHeaders = config.operationHeaders = {
        Authorization: `Bearer ${config.token}`,
      };
    }
    super({ name, config, cache });
  }
}
