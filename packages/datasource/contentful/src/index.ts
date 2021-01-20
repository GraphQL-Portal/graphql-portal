import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const GraphQLHandler = require('@graphql-mesh/graphql');

const DEFAULT_ENDPOINT: string = "https://graphql.contentful.com/";

export default class ContentfulHandler extends GraphQLHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.GraphQLHandler>) {
    if (!config.endpoint) config.endpoint = DEFAULT_ENDPOINT;

    // @ts-ignore
    config.schemaHeaders = { authorization: `Bearer ${config.token}`};
    super({ name, config, cache});
  }
}
