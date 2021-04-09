import { GetMeshSourceOptions, KeyValueCache, MeshHandler, MeshSource } from '@graphql-mesh/types';
import { makeExecutableSchema } from 'graphql-tools';

type Config = {
  getResolverName?: string;
  deleteResolverName?: string;
};

export default class CacheHandler implements MeshHandler {
  private config: Config;
  private cache: KeyValueCache<any>;

  constructor({ config, cache }: GetMeshSourceOptions<Config, any>) {
    this.config = config;
    this.cache = cache;
  }

  async getMeshSource(): Promise<MeshSource> {
    const { getResolverName = 'getCacheByKey', deleteResolverName = 'deleteCacheByKey' } = this.config;

    const schema = makeExecutableSchema({
      typeDefs: `
        scalar Any
        scalar Void
        type Query { ${getResolverName}(key:String!): Any }
        type Mutation { ${deleteResolverName}(key:String!): Void }
      `,
      resolvers: {
        Query: {
          [getResolverName]: (_, { key }) => this.get(key),
        },
        Mutation: {
          [deleteResolverName]: (_, { key }) => this.delete(key),
        },
      },
    });

    return {
      schema,
    };
  }

  private get(key: string) {
    return this.cache.get(key);
  }
  private delete(key: string) {
    return this.cache.delete(key);
  }
}
