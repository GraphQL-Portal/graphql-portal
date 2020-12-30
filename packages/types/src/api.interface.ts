import { GraphQLSchema } from 'graphql';
import { ApiDefConfig } from './api-def-config';
import { SourceConfig } from './mesh-source-config';

export interface ApiDef extends ApiDefConfig {
  sources: SourceConfig[];
  schema?: GraphQLSchema;
}
