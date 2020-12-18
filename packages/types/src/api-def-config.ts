/* eslint-disable */

export interface ApiDefConfig {
  name: string;
  endpoint: string;
  source_config_names?: string[];
  [k: string]: unknown;
}
