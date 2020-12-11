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
  log_level: 'debug' | 'info' | 'warn' | 'error';
  redis_connection_string: string;
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
  hostname: string;
  port: number;
}
