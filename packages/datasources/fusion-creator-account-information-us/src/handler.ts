import OpenAPIHandler from '@graphql-mesh/openapi';
import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

const BASE_URL = 'https://api.fusionfabric.cloud/retail-us/me/account/v1';

export default class FusionCreatorAccountInformationUSHandler extends OpenAPIHandler {
  public constructor({
    name,
    config,
    cache,
    pubsub,
  }: GetMeshSourceOptions<YamlConfig.OpenapiHandler & { authorizationHeader: string }>) {
    config.source = require.resolve('@graphql-portal/fusion-creator-account-information-us/src/source.json');
    config.baseUrl = BASE_URL;
    config.schemaHeaders = config.operationHeaders = {
      Authorization: `Bearer {context.forwardHeaders['${config.authorizationHeader}']}`,
    };

    super({ name, config, cache, pubsub });
  }
}
