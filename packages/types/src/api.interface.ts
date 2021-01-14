import { ApiDefConfig } from './api-def-config';
import { SourceConfig } from './mesh-source-config';

export interface ApiDef extends ApiDefConfig {
  sources: SourceConfig[];
}
