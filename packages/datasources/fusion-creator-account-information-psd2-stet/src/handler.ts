import OpenAPIHandler from '@graphql-mesh/openapi';
import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

const BASE_URL = 'https://api.fusionfabric.cloud/retail/psd2/stet/aisp/v1.3';

export default class FusionCreatorAccountInformationPSD2STET extends OpenAPIHandler {
  public constructor({
    name,
    config,
    cache,
    pubsub,
  }: GetMeshSourceOptions<YamlConfig.OpenapiHandler & { token: string }>) {
    config.source = require.resolve('@graphql-portal/fusion-creator-account-information-psd2-stet/src/source.json');
    config.baseUrl = BASE_URL;
    config.schemaHeaders = config.operationHeaders = {
      Authorization: config.token,
    };

    super({ name, config, cache, pubsub });
  }
}
