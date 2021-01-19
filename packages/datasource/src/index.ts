import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const GraphQLHandler = require('@graphql-mesh/graphql');

export default class ContentfulHandler extends GraphQLHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.GraphQLHandler>) {
    super({ name, config, cache});
  }
}
