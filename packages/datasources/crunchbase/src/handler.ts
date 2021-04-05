import OpenAPIHandler from '@graphql-mesh/openapi';
import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

const OPENAPI_SPECIFICATION = 'https://app.swaggerhub.com/apiproxy/registry/Crunchbase/crunchbase-enterprise_api/1.0.3';
const BASE_URL = 'https://api.crunchbase.com/api/v4';

export default class CrunchbaseHandler extends OpenAPIHandler {
  public constructor({
    name,
    config,
    cache,
    pubsub,
  }: GetMeshSourceOptions<YamlConfig.OpenapiHandler & { userKey: string }>) {
    config.source = OPENAPI_SPECIFICATION;
    config.baseUrl = BASE_URL;
    config.operationHeaders = {
      'X-cb-user-key': config.userKey,
    };
    config.schemaHeaders = {
      'X-cb-user-key': config.userKey,
    };

    super({ name, config, cache, pubsub });
  }
}
