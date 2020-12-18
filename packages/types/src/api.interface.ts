import { SourceConfig } from './mesh-source-config';
import { ApiDefConfig } from './api-def-config';

export interface ApiDef extends ApiDefConfig {
  sources: SourceConfig[];
}
