/* eslint-disable */

export interface GatewayConfig {
  hostname: string;
  listen_port: number;
  /**
   * Should be set when used behind the load-balancer which has a _servername_ different from the gateway's _hostname_.
   */
  servername?: string;
  pool_size?: number;
  apis_path: string;
  middleware_path: string;
  sources_path: string;
  use_dashboard_configs: boolean;
  dashboard_config?: DashboardConfig;
  enable_control_api: boolean;
  control_api_config?: ControlApiConfig;
  cors?: Cors;
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
  secret: string;
}
/**
 * Used to specify GraphQL Portal Control API settings
 */
export interface ControlApiConfig {
  endpoint?: string;
}
/**
 * Configure CORS for all APIs in the gateway. CORS from Dashboard are enabled by default.
 */
export interface Cors {
  /**
   * Enables CORS requests for all APIs. CORS requests from Dashboard are enabled by default.
   */
  enabled?: boolean;
  /**
   * Configures the Access-Control-Allow-Origin CORS header. Expects an Array of valid origins.
   */
  origins?: string[];
  /**
   * Configures the Access-Control-Allow-Methods CORS header. Expects an array of HTTP Methods.
   */
  methods?: ('GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')[];
  /**
   * Configures the Access-Control-Allow-Headers CORS header. Expects and Array of headers.
   */
  allowedHeaders?: string[];
  /**
   * Configures the Access-Control-Expose-Headers CORS header.
   */
  exposedHeaders?: string[];
  /**
   * Configures the Access-Control-Allow-Credentials CORS header.
   */
  credentials?: boolean;
  /**
   * Configures the Access-Control-Max-Age CORS header.
   */
  maxAge?: number;
  /**
   * Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204.
   */
  optionsSuccessStatus?: number;
}
/**
 * Used to specify GraphQL Portal metrics settings
 */
export interface Metrics {
  enabled?: boolean;
}
