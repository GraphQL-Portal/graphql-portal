/* eslint-disable */

export interface GatewayConfig {
  /**
   * The hostname to bind the gateway node to.
   */
  hostname: string;
  /**
   * The port on which the gateway will listen for the incoming connections.
   */
  listen_port: number;
  /**
   * Should be set when used behind the load-balancer which has a _servername_ different from the gateway's _hostname_.
   */
  servername?: string;
  /**
   * Number of worker processes to start. Ideally should be equal to the number of CPU Cores on the machine and should not be set to 1.
   */
  pool_size?: number;
  /**
   * Path to the directory with API Definition files.
   */
  apis_path?: string;
  /**
   * Path to the custom middleware handlers.
   */
  middleware_path?: string;
  /**
   * Path to the data sources configuration files (yaml or json).
   */
  sources_path?: string;
  /**
   * If set to _true_, the gateway will try to connect to the dashboard using the credentials in _dashboard_config_ section and get the API configurations from there.
   */
  use_dashboard_configs: boolean;
  /**
   * Configuration of the connection to GraphQL Portal Dashboard.
   */
  dashboard_config?: {
    connection_string: string;
    secret: string;
  };
  /**
   * Enables or disables the Control API which is used to update GraphQL Schema definitions.
   */
  enable_control_api: boolean;
  /**
   * Configuration of the Control API
   */
  control_api_config?: {
    endpoint?: string;
  };
  /**
   * Configuration of CORS requests.
   */
  cors?: {
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
  };
  /**
   * Configuration of the analytics/metrics.
   */
  metrics?: {
    enabled?: boolean;
  };
  /**
   * Sets the logging format. Can be 'text' or 'json'. JSON should be used while running in a Kubernetes pod.
   */
  log_format?: 'text' | 'json';
  /**
   * Sets the log level. Should not be set to 'debug' in production.
   */
  log_level: 'debug' | 'info' | 'warn' | 'error';
  /**
   * Redis connection string in a format 'redis://localhost:6379'.
   */
  redis_connection_string: string;
  /**
   * This value specifies an HTTP Request size limit for a particular API Definition. Accepts numeric (in bytes) or string values, i.e. 'b' for bytes, 'kb' for kilobytes and 'mb' for megabytes (f.e., '10kb' or '10mb').
   */
  request_size_limit?: string | number;
}
