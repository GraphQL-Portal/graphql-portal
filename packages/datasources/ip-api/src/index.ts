import { readFileSync } from 'fs';
import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

// eslint-disable-next-line @typescript-eslint/naming-convention
const OpenAPIHandler = require('@graphql-mesh/openapi');

const BASE_URL = 'https://ip-api.com';

export default class IPAPIHandler extends OpenAPIHandler {
  public constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = readFileSync('./source.json').toString();
    config.baseUrl = BASE_URL;

    super({ name, config, cache });
  }
}
