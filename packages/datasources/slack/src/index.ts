import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION: string = 'https://api.slack.com/specs/openapi/v2/slack_web.json';

export default class SlackHandler extends OpenAPIHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;

    // @ts-ignore
    config.schemaHeaders = { authorization: `Bearer ${config.token}`};
    super({ name, config, cache});
  }
}
