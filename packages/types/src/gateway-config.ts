/* eslint-disable */

export interface GatewayConfig {
  hostname: string;
  listen_port: number;
  pool_size?: number;
  secret: string;
  apis_path: string;
  middleware_path: string;
  sources_path: string;
  use_dashboard_configs: boolean;
  dashboard_config?: DashboardConfig;
  enable_control_api: boolean;
  control_api_config?: ControlApiConfig;
  metrics?: Metrics;
  log_format?: 'text' | 'json';
  log_level: 'debug' | 'info' | 'warn' | 'error';
  redis_connection_string: string;
  /**
   * Argument of the bytes package's method parse https://www.npmjs.com/package/bytes
   */
  request_size_limit?: string | number;
}
/**
 * Used to specify GraphQL Portal Dashboard connection settings
 */
export interface DashboardConfig {
  connection_string: string;
}
/**
 * Used to specify GraphQL Portal Control API settings
 */
export interface ControlApiConfig {
  endpoint?: string;
}
/**
 * Used to specify GraphQL Portal Metrics settings
 */
export interface Metrics {
  enabled: boolean;
}
