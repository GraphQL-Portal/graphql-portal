/* eslint-disable */

export interface GatewayConfig {
  apiDefs?: {
    [k: string]: unknown;
  }[];
  sources?: {
    [k: string]: unknown;
  }[];
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
  use_dashboard_configs?: boolean;
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
  enable_control_api?: boolean;
  /**
   * Enable or disable metrics recording to Redis
   */
  enable_metrics_recording?: boolean;
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
   * Sets the default (console) logging format. Can be 'text' or 'json'. JSON should be used while running in a Kubernetes pod.
   */
  log_format?: 'text' | 'json';
  /**
   * Sets the log level. Should not be set to 'debug' in production.
   */
  log_level?: 'debug' | 'info' | 'warn' | 'error';
  /**
   * Regexp that filters debug-level logs by context.
   */
  log_filter?: string;
  /**
   * Configures sending of log messages to Datadog.
   */
  datadog_logging?: {
    /**
     * Enable or disable logging to Datadog. Defaults to false.
     */
    enabled: boolean;
    /**
     * Datadog API key of your application
     */
    apiKey: string;
    /**
     * Host of the Datadog TCP (TLS) intake. Defaults to the US server (intake.logs.datadoghq.com).
     */
    host?: string;
    /**
     * Port of the Datadog TCP (TLS) intake. Defaults to 10516.
     */
    port?: number;
    /**
     * Adds an environment attribute to Datadog logs. Empty by default.
     */
    environment?: string;
    /**
     * Allows transport level tagging in Datadog. Each tag should follow the format <KEY>:<VALUE>. For more information see https://docs.datadoghq.com/getting_started/tagging/.
     */
    tags?: string[];
  };
  /**
   * Configures sending of log messages to Redis.
   */
  redis_logging?: {
    /**
     * Enable or disable logging to Redis. Defaults to false.
     */
    enabled: boolean;
    /**
     * After the timeout has expired, the log will automatically be deleted (in seconds)
     */
    expire: number;
    /**
     * Sets the redis log level. Should not be set to 'debug' in production.
     */
    log_level?: 'debug' | 'info' | 'warn' | 'error';
  };
  /**
   * (Deprecated) Redis connection string in a format 'redis://localhost:6379'.
   */
  redis_connection_string?: string;
  /**
   * Redis connection options
   */
  redis?:
    | {
        /**
         * Redis connection string in a format 'redis://localhost:6379'.
         */
        connection_string?: string;
      }
    | {
        /**
         * Is connection to cluster
         */
        is_cluster?: boolean;
        cluster_nodes?: string[];
      };
  /**
   * This value specifies an HTTP Request size limit for a particular API Definition. Accepts numeric (in bytes) or string values, i.e. 'b' for bytes, 'kb' for kilobytes and 'mb' for megabytes (f.e., '10kb' or '10mb').
   */
  request_size_limit?: string | number;
  /**
   * Configure agent endpoint
   */
  tracing?: {
    /**
     * Allows to enable/disable the tracing at all
     */
    enable?: ('jaeger' | 'datadog') | boolean;
    /**
     * Configures sending of traces to Jaeger
     */
    jaeger?: {
      /**
       * The host of your Jaeger agent. Defaults to 'localhost'
       */
      host?: string;
      /**
       * The port of your Jaeger agent. Defaults to 6832
       */
      port?: number;
    };
    /**
     * Configures sending of traces to Datadog
     */
    datadog?: {
      /**
       * The host of your Datadog agent. Defaults to 'localhost'
       */
      host?: string;
      /**
       * The port of your Datadog agent. Defaults to 8126
       */
      port?: number;
    };
  };
}
