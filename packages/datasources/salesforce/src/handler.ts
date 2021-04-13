import OpenAPIHandler from '@graphql-mesh/openapi';
import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

const OPENAPI_SPECIFICATION =
  'http://resources.docs.salesforce.com/rel1/doc/en-us/static/misc/iot-connect-api-swagger-45.0.yaml';

export default class SalesforceHandler extends OpenAPIHandler {
  public constructor({
    name,
    config,
    cache,
    pubsub,
  }: GetMeshSourceOptions<YamlConfig.OpenapiHandler & { token?: string }>) {
    config.source = OPENAPI_SPECIFICATION;
    if (config.token) {
      config.schemaHeaders = config.operationHeaders = {
        Authorization: `Bearer ${config.token}`,
      };
    }
    super({ name, config, cache, pubsub });
  }
}
