import { Source } from '@graphql-mesh/types/config';
import { ApiConfig } from './api-config';

export interface Api extends ApiConfig {
  sources: Source[];
}
