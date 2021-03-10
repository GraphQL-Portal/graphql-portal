import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';

// eslint-disable-next-line @typescript-eslint/naming-convention
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION = 'https://api.slack.com/specs/openapi/v2/slack_web.json';
const BASE_URL = 'https://slack.com/api';

export default class SlackHandler extends OpenAPIHandler {
  public constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;
    config.baseUrl = BASE_URL;

    super({ name, config, cache });
  }
}