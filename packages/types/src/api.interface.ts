import { Source } from '@graphql-mesh/types/config';
import { ApiConfig } from './api-config';

export interface ApiDef extends ApiConfig {
  sources: Source[];
}
