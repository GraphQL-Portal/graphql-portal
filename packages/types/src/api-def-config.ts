/* eslint-disable */

export interface ApiDefConfig {
  name: string;
  endpoint: string;
  source_config_names?: string[];
  source_names?: string[];
  schema_polling_interval?: number;
  schema_updates_through_control_api?: boolean;
  enable_ip_filtering?: boolean;
  allow_ips?: string[];
  deny_ips?: string[];
  /**
   * This value specifies an HTTP Request size limit for a particular API Definition. Accepts numeric (in bytes) or string values, i.e. 'b' for bytes, 'kb' for kilobytes and 'mb' for megabytes (f.e., '10kb' or '10mb').
   */
  request_size_limit?: string | number;
  /**
   * Maximum GraphQL query depth
   */
  depth_limit?: number;
  /**
   * Maximum complexity for a request
   */
  request_complexity_limit?: number;
  /**
   * Allowed queries summary complexity for a user in a period of time
   */
  rate_limit?: {
    complexity: number;
    per: number;
  };
  authentication?: {
    auth_header_name?: string;
    auth_tokens: string[];
  };
  playground?: boolean;
  mesh?: {
    serve?: ServeConfig;
    require?: string[];
    /**
     * Defines the list of your external data sources for your API mesh
     */
    sources?: Source[];
    /**
     * Transform to apply to the unified mesh schema
     */
    transforms?: Transform[];
    /**
     * Additional type definitions, or type definitions overrides you wish to add to the schema mesh
     */
    additionalTypeDefs?:
      | {
          [k: string]: unknown;
        }
      | string
      | unknown[];
    /**
     * Additional resolvers, or resolvers overrides you wish to add to the schema mesh (Any of: String, AdditionalStitchingResolverObject, AdditionalSubscriptionObject)
     */
    additionalResolvers?: (string | AdditionalStitchingResolverObject | AdditionalSubscriptionObject)[];
    cache?: Cache;
    /**
     * Merge method
     */
    merger?: string;
    /**
     * PubSub Implementation (Any of: String, PubSubConfig)
     */
    pubsub?: string | PubSubConfig;
    /**
     * Live Query Invalidations
     */
    liveQueryInvalidations?: LiveQueryInvalidation[];
  };
}
/**
 * Configuration for `mesh serve` command.
 * Those commands won't be available in programmatic usage.
 */
export interface ServeConfig {
  /**
   * Spawn multiple server instances as node clusters (default: `1`) (Any of: Int, Boolean)
   */
  fork?: number | boolean;
  /**
   * TCP Port to listen (default: `3000`) (Any of: Int, String)
   */
  port?: number | string;
  /**
   * The binding hostname (default: `localhost`)
   */
  hostname?: string;
  /**
   * Provide an example query or queries for GraphQL Playground
   * The value can be the file path, glob expression for the file paths or the SDL.
   * (.js, .jsx, .graphql, .gql, .ts and .tsx files are supported.
   * But TypeScript support is only available if `ts-node` is installed and `ts-node/register` is added under `require` parameter)
   */
  exampleQuery?: string;
  cors?: CorsConfig;
  /**
   * Express/Connect compatible handlers and middlewares extend GraphQL Mesh HTTP Server (Any of: WebhookHandler, ExpressHandler)
   */
  handlers?: (WebhookHandler | ExpressHandler)[];
  /**
   * Path to your static files you want to be served with GraphQL Mesh HTTP Server
   */
  staticFiles?: string;
  /**
   * Show GraphiQL Playground
   */
  playground?: boolean;
  /**
   * Controls the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the bytes library for parsing. Defaults to '100kb'. (Any of: Int, String)
   */
  maxRequestBodySize?: number | string;
  upload?: UploadOptions;
  sslCredentials?: HTTPSConfig;
  /**
   * Path to GraphQL Endpoint (default: /graphql)
   */
  endpoint?: string;
}
/**
 * Configuration for CORS
 */
export interface CorsConfig {
  origin?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
}
export interface WebhookHandler {
  /**
   * Path that remote API will ping
   */
  path: string;
  /**
   * Name of the topic you want to pass incoming payload
   */
  pubsubTopic: string;
  /**
   * Part of the object you want to pass (e.g. `data.messages`)
   */
  payload?: string;
}
export interface ExpressHandler {
  /**
   * Path that the handler will control
   */
  path: string;
  /**
   * Path of the handler's code
   */
  handler: string;
  /**
   * HTTP Method that the handler will control (Allowed values: GET, POST, DELETE, PATCH)
   */
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH';
}
/**
 * Configuration for GraphQL File Upload
 */
export interface UploadOptions {
  /**
   * Maximum File Size for GraphQL Upload (default: `100000000`)
   */
  maxFileSize?: number;
  /**
   * Maximum number of files for GraphQL Upload (default: `10`)
   */
  maxFiles?: number;
}
/**
 * SSL Credentials for HTTPS Server
 * If this is provided, Mesh will be served via HTTPS
 */
export interface HTTPSConfig {
  key: string;
  cert: string;
}
export interface Source {
  /**
   * The name you wish to set to your remote API, this will be used for building the GraphQL context
   */
  name: string;
  handler: Handler;
  /**
   * List of transforms to apply to the current API source, before unifying it with the rest of the sources
   */
  transforms?: Transform[];
}
/**
 * Point to the handler you wish to use, it can either be a predefined handler, or a custom
 */
export interface Handler {
  fhir?: FhirHandler;
  graphql?: GraphQLHandler;
  grpc?: GrpcHandler;
  jsonSchema?: JsonSchemaHandler;
  mongoose?: MongooseHandler;
  mysql?: MySQLHandler;
  neo4j?: Neo4JHandler;
  odata?: ODataHandler;
  openapi?: OpenapiHandler;
  postgraphile?: PostGraphileHandler;
  soap?: SoapHandler;
  thrift?: ThriftHandler;
  tuql?: TuqlHandler;
  ContentfulHandler?: ContentfulHandler;
  CrunchbaseHandler?: CrunchbaseHandler;
  SalesforceHandler?: SalesforceHandler;
  SlackHandler?: SlackHandler;
  StripeHandler?: StripeHandler;
  TwitterHandler?: TwitterHandler;
  WeatherbitHandler?: WeatherbitHandler;
  IPAPIHandler?: IPAPIHandler;
  [k: string]: unknown;
}
export interface FhirHandler {
  endpoint?: string;
}
/**
 * Handler for remote/local/third-party GraphQL schema
 */
export interface GraphQLHandler {
  /**
   * A url or file path to your remote GraphQL endpoint.
   * If you provide a path to a code file(js or ts),
   * other options will be ignored and the schema exported from the file will be used directly.
   */
  endpoint: string;
  /**
   * JSON object representing the Headers to add to the runtime of the API calls only for schema introspection
   * You can also provide `.js` or `.ts` file path that exports schemaHeaders as an object
   */
  schemaHeaders?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  /**
   * JSON object representing the Headers to add to the runtime of the API calls only for operation during runtime
   */
  operationHeaders?: {
    [k: string]: unknown;
  };
  /**
   * Use HTTP GET for Query operations
   */
  useGETForQueries?: boolean;
  /**
   * HTTP method used for GraphQL operations (Allowed values: GET, POST)
   */
  method?: 'GET' | 'POST';
  /**
   * Use Server Sent Events instead of WebSocket for Subscriptions
   */
  useSSEForSubscription?: boolean;
  /**
   * Path to a custom W3 Compatible Fetch Implementation
   */
  customFetch?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  /**
   * Path to a custom W3 Compatible WebSocket Implementation
   */
  webSocketImpl?: string;
  /**
   * Path to the introspection
   * You can seperately give schema introspection
   */
  introspection?: string;
  /**
   * Cache Introspection (Any of: GraphQLIntrospectionCachingOptions, Boolean)
   */
  cacheIntrospection?: GraphQLIntrospectionCachingOptions | boolean;
  /**
   * Enable multipart/formdata in order to support file uploads
   */
  multipart?: boolean;
  /**
   * Batch requests
   */
  batch?: boolean;
}
export interface GraphQLIntrospectionCachingOptions {
  /**
   * Time to live of introspection cache
   */
  ttl?: number;
  /**
   * Path to Introspection JSON File
   */
  path?: string;
}
/**
 * Handler for gRPC and Protobuf schemas
 */
export interface GrpcHandler {
  /**
   * gRPC Endpoint
   */
  endpoint: string;
  /**
   * gRPC Proto file that contains your protobuf schema (Any of: ProtoFilePath, String)
   */
  protoFilePath?: ProtoFilePath | string;
  /**
   * Use a binary-encoded or JSON file descriptor set file (Any of: ProtoFilePath, String)
   */
  descriptorSetFilePath?: ProtoFilePath | string;
  /**
   * Your base service name
   * Used for naming only
   */
  serviceName?: string;
  /**
   * Your base package name
   * Used for naming only
   */
  packageName?: string;
  /**
   * Request timeout in milliseconds
   * Default: 200000
   */
  requestTimeout?: number;
  credentialsSsl?: GrpcCredentialsSsl;
  /**
   * Use https instead of http for gRPC connection
   */
  useHTTPS?: boolean;
  /**
   * MetaData
   */
  metaData?: {
    [k: string]: unknown;
  };
  /**
   * Use gRPC reflection to automatically gather the connection
   */
  useReflection?: boolean;
}
export interface ProtoFilePath {
  file: string;
  load?: LoadOptions;
}
export interface LoadOptions {
  defaults?: boolean;
  includeDirs?: string[];
}
/**
 * SSL Credentials
 */
export interface GrpcCredentialsSsl {
  rootCA?: string;
  certChain?: string;
  privateKey?: string;
}
/**
 * Handler for JSON Schema specification. Source could be a local json file, or a url to it.
 */
export interface JsonSchemaHandler {
  baseUrl?: string;
  operationHeaders?: {
    [k: string]: unknown;
  };
  schemaHeaders?: {
    [k: string]: unknown;
  };
  operations: JsonSchemaOperation[];
  disableTimestampScalar?: boolean;
  baseSchema?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  /**
   * Field name of your custom error object (default: 'message')
   */
  errorMessageField?: string;
}
export interface JsonSchemaOperation {
  field: string;
  path?: string;
  pubsubTopic?: string;
  description?: string;
  /**
   * Allowed values: Query, Mutation, Subscription
   */
  type: 'Query' | 'Mutation' | 'Subscription';
  /**
   * Allowed values: GET, DELETE, POST, PUT, PATCH
   */
  method?: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  requestSchema?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  requestSample?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  requestTypeName?: string;
  responseSample?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  responseSchema?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  responseTypeName?: string;
  argTypeMap?: {
    [k: string]: unknown;
  };
  headers?: {
    [k: string]: unknown;
  };
}
export interface MongooseHandler {
  connectionString?: string;
  models?: MongooseModel[];
  discriminators?: MongooseModel[];
}
export interface MongooseModel {
  name: string;
  path: string;
  options?: ComposeWithMongooseOpts;
}
export interface ComposeWithMongooseOpts {
  name?: string;
  description?: string;
  fields?: ComposeWithMongooseFieldsOpts;
  inputType?: ComposeMongooseInputType;
  resolvers?: TypeConverterResolversOpts;
}
export interface ComposeWithMongooseFieldsOpts {
  only?: string[];
  remove?: string[];
  required?: string[];
}
export interface ComposeMongooseInputType {
  name?: string;
  description?: string;
  fields?: ComposeWithMongooseFieldsOpts;
  resolvers?: TypeConverterResolversOpts;
}
export interface TypeConverterResolversOpts {
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  findById?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  findByIds?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  findOne?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  findMany?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  updateById?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  updateOne?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  updateMany?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  removeById?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  removeOne?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  removeMany?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  createOne?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  createMany?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, ComposeWithMongooseResolverOpts
   */
  count?: boolean | ComposeWithMongooseResolverOpts;
  /**
   * Any of: Boolean, JSON
   */
  connection?:
    | boolean
    | {
        [k: string]: unknown;
      };
  /**
   * Any of: Boolean, PaginationResolverOpts
   */
  pagination?: boolean | PaginationResolverOpts;
}
export interface ComposeWithMongooseResolverOpts {
  filter?: FilterHelperArgsOpts;
  sort?: SortHelperArgsOpts;
  limit?: LimitHelperArgsOpts;
  record?: RecordHelperArgsOpts;
  skip?: boolean;
}
export interface FilterHelperArgsOpts {
  filterTypeName?: string;
  isRequired?: boolean;
  onlyIndexed?: boolean;
  requiredFields?: string[];
  /**
   * Any of: Boolean, JSON
   */
  operators?:
    | boolean
    | {
        [k: string]: unknown;
      };
  removeFields?: string[];
}
export interface SortHelperArgsOpts {
  sortTypeName?: string;
}
export interface LimitHelperArgsOpts {
  defaultValue?: number;
}
export interface RecordHelperArgsOpts {
  recordTypeName?: string;
  isRequired?: boolean;
  removeFields?: string[];
  requiredFields?: string[];
}
export interface PaginationResolverOpts {
  perPage?: number;
}
export interface MySQLHandler {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  /**
   * Use existing `Pool` instance
   * Format: modulePath#exportName
   */
  pool?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
}
/**
 * Handler for Neo4j
 */
export interface Neo4JHandler {
  /**
   * URL for the Neo4j Instance e.g. neo4j://localhost
   */
  url: string;
  /**
   * Username for basic authentication
   */
  username: string;
  /**
   * Password for basic authentication
   */
  password: string;
  /**
   * Specifies whether relationships should always be included in the type definitions as [relationship](https://grandstack.io/docs/neo4j-graphql-js.html#relationship-types) types, even if the relationships do not have properties.
   */
  alwaysIncludeRelationships?: boolean;
  /**
   * Specifies database name
   */
  database?: string;
  /**
   * Provide GraphQL Type Definitions instead of inferring
   */
  typeDefs?: string;
  /**
   * Cache Introspection (Any of: Neo4jIntrospectionCachingOptions, Boolean)
   */
  cacheIntrospection?: Neo4JIntrospectionCachingOptions | boolean;
}
export interface Neo4JIntrospectionCachingOptions {
  /**
   * Time to live of introspection cache
   */
  ttl?: number;
}
/**
 * Handler for OData
 */
export interface ODataHandler {
  /**
   * Base URL for OData API
   */
  baseUrl: string;
  /**
   * Custom $metadata File or URL
   */
  metadata?: string;
  /**
   * Headers to be used with the operation requests
   */
  operationHeaders?: {
    [k: string]: unknown;
  };
  /**
   * Headers to be used with the $metadata requests
   */
  schemaHeaders?: {
    [k: string]: unknown;
  };
  /**
   * Enable batching (Allowed values: multipart, json)
   */
  batch?: 'multipart' | 'json';
  /**
   * Use $expand for navigation props instead of seperate HTTP requests (Default: false)
   */
  expandNavProps?: boolean;
}
/**
 * Handler for Swagger / OpenAPI 2/3 specification. Source could be a local json/swagger file, or a url to it.
 */
export interface OpenapiHandler {
  /**
   * A pointer to your API source - could be a local file, remote file or url endpoint
   */
  source: string;
  /**
   * Format of the source file (Allowed values: json, yaml)
   */
  sourceFormat?: 'json' | 'yaml';
  /**
   * JSON object representing the Headers to add to the runtime of the API calls
   */
  operationHeaders?: {
    [k: string]: unknown;
  };
  /**
   * If you are using a remote URL endpoint to fetch your schema, you can set headers for the HTTP request to fetch your schema.
   */
  schemaHeaders?: {
    [k: string]: unknown;
  };
  /**
   * Specifies the URL on which all paths will be based on.
   * Overrides the server object in the OAS.
   */
  baseUrl?: string;
  /**
   * JSON object representing the query search parameters to add to the API calls
   */
  qs?: {
    [k: string]: unknown;
  };
  /**
   * W3 Compatible Fetch Implementation
   */
  customFetch?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  /**
   * Include HTTP Response details to the result object
   */
  includeHttpDetails?: boolean;
  /**
   * Auto-generate a 'limit' argument for all fields that return lists of objects, including ones produced by links
   */
  addLimitArgument?: boolean;
  /**
   * Set argument name for mutation payload to 'requestBody'. If false, name defaults to camelCased pathname
   */
  genericPayloadArgName?: boolean;
  /**
   * Allows to explicitly override the default operation (Query or Mutation) for any OAS operation
   */
  selectQueryOrMutationField?: SelectQueryOrMutationFieldConfig[];
}
export interface SelectQueryOrMutationFieldConfig {
  /**
   * OAS Title
   */
  title?: string;
  /**
   * Operation Path
   */
  path?: string;
  /**
   * Target Root Type for this operation (Allowed values: Query, Mutation)
   */
  type?: 'Query' | 'Mutation';
  /**
   * Which method is used for this operation
   */
  method?: string;
}
/**
 * Handler for Postgres database, based on `postgraphile`
 */
export interface PostGraphileHandler {
  /**
   * A connection string to your Postgres database
   */
  connectionString?: string;
  /**
   * An array of strings which specifies the PostgreSQL schemas that PostGraphile will use to create a GraphQL schema. The default schema is the public schema.
   */
  schemaName?: string[];
  /**
   * Connection Pool instance or settings or you can provide the path of a code file that exports any of those
   */
  pool?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  /**
   * Extra Postgraphile Plugins to append
   */
  appendPlugins?: string[];
  /**
   * Postgraphile Plugins to skip (e.g. "graphile-build#NodePlugin")
   */
  skipPlugins?: string[];
  /**
   * Extra Postgraphile options that will be added to the postgraphile constructor. It can either be an object or a string pointing to the object's path (e.g. "./my-config#options"). See the [postgraphile docs](https://www.graphile.org/postgraphile/usage-library/) for more information. (Any of: JSON, String)
   */
  options?:
    | {
        [k: string]: unknown;
      }
    | string;
  /**
   * Cache Introspection (Any of: GraphQLIntrospectionCachingOptions, Boolean)
   */
  cacheIntrospection?: GraphQLIntrospectionCachingOptions | boolean;
  /**
   * Enable GraphQL websocket transport support for subscriptions (default: true)
   */
  subscriptions?: boolean;
  /**
   * Enables live-query support via GraphQL subscriptions (sends updated payload any time nested collections/records change) (default: true)
   */
  live?: boolean;
}
/**
 * Handler for SOAP
 */
export interface SoapHandler {
  /**
   * A url to your WSDL
   */
  wsdl: string;
  basicAuth?: SoapSecurityBasicAuthConfig;
  securityCert?: SoapSecurityCertificateConfig;
  /**
   * JSON object representing the Headers to add to the runtime of the API calls only for schema introspection
   * You can also provide `.js` or `.ts` file path that exports schemaHeaders as an object
   */
  schemaHeaders?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  /**
   * JSON object representing the Headers to add to the runtime of the API calls only for operation during runtime
   */
  operationHeaders?: {
    [k: string]: unknown;
  };
}
/**
 * Basic Authentication Configuration
 * Including username and password fields
 */
export interface SoapSecurityBasicAuthConfig {
  /**
   * Username for Basic Authentication
   */
  username: string;
  /**
   * Password for Basic Authentication
   */
  password: string;
}
/**
 * SSL Certificate Based Authentication Configuration
 * Including public key, private key and password fields
 */
export interface SoapSecurityCertificateConfig {
  /**
   * Your public key
   */
  publicKey?: string;
  /**
   * Your private key
   */
  privateKey?: string;
  /**
   * Password
   */
  password?: string;
  /**
   * Path to the file or URL contains your public key
   */
  publicKeyPath?: string;
  /**
   * Path to the file or URL contains your private key
   */
  privateKeyPath?: string;
  /**
   * Path to the file or URL contains your password
   */
  passwordPath?: string;
}
/**
 * Handler for OData
 */
export interface ThriftHandler {
  /**
   * The name of the host to connect to.
   */
  hostName: string;
  /**
   * The port number to attach to on the host.
   */
  port: number;
  /**
   * The path on which the Thrift service is listening. Defaults to '/thrift'.
   */
  path?: string;
  /**
   * Boolean value indicating whether to use https. Defaults to false.
   */
  https?: boolean;
  /**
   * Name of the Thrift protocol type to use. Defaults to 'binary'. (Allowed values: binary, compact, json)
   */
  protocol?: 'binary' | 'compact' | 'json';
  /**
   * The name of your service. Used for logging.
   */
  serviceName: string;
  /**
   * JSON object representing the Headers to add to the runtime of the API calls
   */
  operationHeaders?: {
    [k: string]: unknown;
  };
  /**
   * If you are using a remote URL endpoint to fetch your schema, you can set headers for the HTTP request to fetch your schema.
   */
  schemaHeaders?: {
    [k: string]: unknown;
  };
  /**
   * Path to IDL file
   */
  idl: string;
}
/**
 * Handler for SQLite database, based on `tuql`
 */
export interface TuqlHandler {
  /**
   * Pointer to your SQLite database
   */
  db?: string;
  /**
   * Path to the SQL Dump file if you want to build a in-memory database
   */
  infile?: string;
}
export interface ContentfulHandler {
  /**
   * Authentication token
   */
  token: string;
  /**
   * A endpoint of your Contentful GraphQL API
   */
  endpoint: string;
}
export interface CrunchbaseHandler {
  /**
   * Authentication API Key
   */
  userKey: string;
}
export interface SalesforceHandler {
  /**
   * A endpoint of your Salesforce API
   */
  baseUrl: string;
  /**
   * Authentication token
   */
  token?: string;
}
export interface SlackHandler {
  /**
   * Slack API access token
   */
  token: string;
}
export interface StripeHandler {
  /**
   * Authentication token
   */
  token: string;
}
export interface TwitterHandler {
  /**
   * Authorization header. Set up the following variables in order to run each request (depending on the authentication type used by the request you are sending):
   *
   * |Name|Description|
   * |---|---|
   * |`consumer_key`|Your consumer key|
   * |`consumer_secret`|Your consumer secret|
   * |`access_token`|Your access token|
   * |`token_secret`|Your access token secret|
   * |`bearer_token`|Your bearer token|
   *
   */
  authorization: string;
}
export interface WeatherbitHandler {}
export interface IPAPIHandler {}
export interface Transform {
  /**
   * Transformer to apply caching for your data sources
   */
  cache?: CacheTransformConfig[];
  encapsulate?: EncapsulateTransformObject;
  extend?: ExtendTransform;
  federation?: FederationTransform;
  /**
   * Transformer to filter (white/black list) GraphQL types, fields and arguments (Any of: FilterSchemaTransform, Any)
   */
  filterSchema?:
    | FilterSchemaTransform
    | (
        | {
            [k: string]: unknown;
          }
        | string
        | unknown[]
      );
  mock?: MockingConfig;
  namingConvention?: NamingConventionTransformConfig;
  prefix?: PrefixTransformConfig;
  /**
   * Transformer to rename GraphQL types and fields (Any of: RenameTransform, Any)
   */
  rename?:
    | RenameTransform
    | (
        | {
            [k: string]: unknown;
          }
        | string
        | unknown[]
      );
  /**
   * Transformer to apply composition to resolvers
   */
  resolversComposition?: ResolversCompositionTransformObject[];
  snapshot?: SnapshotTransformConfig;
  [k: string]: unknown;
}
export interface CacheTransformConfig {
  /**
   * The type and field to apply cache to, you can use wild cards as well, for example: `Query.*`
   */
  field: string;
  /**
   * Cache key to use to store your resolvers responses.
   * The defualt is: {typeName}-{fieldName}-{argsHash}-{fieldNamesHash}
   *
   * Available variables:
   * - {args.argName} - use resolver argument
   * - {typeName} - use name of the type
   * - {fieldName} - use name of the field
   * - {argsHash} - a hash based on the 'args' object
   * - {fieldNamesHash} - a hash based on the field names selected by the client
   * - {info} - the GraphQLResolveInfo of the resolver
   *
   * Available interpolations:
   * - {format|date} - returns the current date with a specific format
   */
  cacheKey?: string;
  invalidate?: CacheInvalidateConfig;
}
/**
 * Invalidation rules
 */
export interface CacheInvalidateConfig {
  /**
   * Invalidate the cache when a specific operation is done without an error
   */
  effectingOperations?: CacheEffectingOperationConfig[];
  /**
   * Specified in seconds, the time-to-live (TTL) value limits the lifespan
   */
  ttl?: number;
}
export interface CacheEffectingOperationConfig {
  /**
   * Path to the operation that could effect it. In a form: Mutation.something. Note that wildcard is not supported in this field.
   */
  operation: string;
  /**
   * Cache key to invalidate on sucessful resolver (no error), see `cacheKey` for list of available options in this field.
   */
  matchKey?: string;
}
/**
 * Transformer to apply encapsulation to the API source, by creating a field for it under the root query
 */
export interface EncapsulateTransformObject {
  /**
   * Optional, name to use for grouping under the root types. If not specific, the API name is used.
   */
  name?: string;
  applyTo?: EncapsulateTransformApplyTo;
}
/**
 * Allow you to choose which root operations you would like to apply. By default, it's applied to all root types.
 */
export interface EncapsulateTransformApplyTo {
  query?: boolean;
  mutation?: boolean;
  subscription?: boolean;
}
export interface ExtendTransform {
  typeDefs?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
  resolvers?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
}
export interface FederationTransform {
  types?: FederationTransformType[];
}
export interface FederationTransformType {
  name: string;
  config?: FederationObjectConfig;
}
export interface FederationObjectConfig {
  keyFields?: string[];
  extend?: boolean;
  fields?: FederationField[];
  /**
   * Any of: String, ResolveReferenceObject
   */
  resolveReference?: string | ResolveReferenceObject;
}
export interface FederationField {
  name: string;
  config: FederationFieldConfig;
}
export interface FederationFieldConfig {
  external?: boolean;
  provides?: string;
  required?: string;
}
export interface ResolveReferenceObject {
  targetSource: string;
  targetMethod: string;
  args: {
    [k: string]: unknown;
  };
  returnData?: string;
  resultSelectedFields?: {
    [k: string]: unknown;
  };
  resultSelectionSet?: string;
  resultDepth?: number;
}
export interface FilterSchemaTransform {
  /**
   * Specify to apply filter-schema transforms to bare schema or by wrapping original schema (Allowed values: bare, wrap)
   */
  mode?: 'bare' | 'wrap';
  /**
   * Array of filter rules
   */
  filters: string[];
}
/**
 * Mock configuration for your source
 */
export interface MockingConfig {
  /**
   * If this expression is truthy, mocking would be enabled
   * You can use environment variables expression, for example: `${MOCKING_ENABLED}`
   */
  if?: boolean;
  /**
   * Do not mock any other resolvers other than defined in `mocks`.
   * For example, you can enable this if you don't want to mock entire schema but partially.
   */
  preserveResolvers?: boolean;
  /**
   * Mock configurations
   */
  mocks?: MockingFieldConfig[];
}
export interface MockingFieldConfig {
  /**
   * Resolver path
   * Example: User.firstName
   */
  apply: string;
  /**
   * If this expression is truthy, mocking would be enabled
   * You can use environment variables expression, for example: `${MOCKING_ENABLED}`
   */
  if?: boolean;
  /**
   * Faker.js expression or function
   * Read more (https://github.com/marak/Faker.js/#fakerfake)
   * Example;
   * faker: name.firstName
   * faker: "{{ name.firstName }} {{ name.lastName }}"
   */
  faker?: string;
  /**
   * Custom mocking
   * It can be a module or json file.
   * Both "moduleName#exportName" or only "moduleName" would work
   */
  custom?: string;
}
/**
 * Transformer to apply naming convention to GraphQL Types
 */
export interface NamingConventionTransformConfig {
  /**
   * Allowed values: camelCase, capitalCase, constantCase, dotCase, headerCase, noCase, paramCase, pascalCase, pathCase, sentenceCase, snakeCase, upperCase, lowerCase
   */
  typeNames?:
    | 'camelCase'
    | 'capitalCase'
    | 'constantCase'
    | 'dotCase'
    | 'headerCase'
    | 'noCase'
    | 'paramCase'
    | 'pascalCase'
    | 'pathCase'
    | 'sentenceCase'
    | 'snakeCase'
    | 'upperCase'
    | 'lowerCase';
  /**
   * Allowed values: camelCase, capitalCase, constantCase, dotCase, headerCase, noCase, paramCase, pascalCase, pathCase, sentenceCase, snakeCase, upperCase, lowerCase
   */
  fieldNames?:
    | 'camelCase'
    | 'capitalCase'
    | 'constantCase'
    | 'dotCase'
    | 'headerCase'
    | 'noCase'
    | 'paramCase'
    | 'pascalCase'
    | 'pathCase'
    | 'sentenceCase'
    | 'snakeCase'
    | 'upperCase'
    | 'lowerCase';
  /**
   * Allowed values: camelCase, capitalCase, constantCase, dotCase, headerCase, noCase, paramCase, pascalCase, pathCase, sentenceCase, snakeCase, upperCase, lowerCase
   */
  enumValues?:
    | 'camelCase'
    | 'capitalCase'
    | 'constantCase'
    | 'dotCase'
    | 'headerCase'
    | 'noCase'
    | 'paramCase'
    | 'pascalCase'
    | 'pathCase'
    | 'sentenceCase'
    | 'snakeCase'
    | 'upperCase'
    | 'lowerCase';
}
/**
 * Prefix transform
 */
export interface PrefixTransformConfig {
  /**
   * The prefix to apply to the schema types. By default it's the API name.
   */
  value?: string;
  /**
   * List of ignored types
   */
  ignore?: string[];
  /**
   * Changes root types and changes the field names
   */
  includeRootOperations?: boolean;
}
export interface RenameTransform {
  /**
   * Specify to apply rename transforms to bare schema or by wrapping original schema (Allowed values: bare, wrap)
   */
  mode?: 'bare' | 'wrap';
  /**
   * Array of rename rules
   */
  renames: RenameTransformObject[];
}
export interface RenameTransformObject {
  from: RenameConfig;
  to: RenameConfig;
  /**
   * Use Regular Expression for type names
   */
  useRegExpForTypes?: boolean;
  /**
   * Use Regular Expression for field names
   */
  useRegExpForFields?: boolean;
}
export interface RenameConfig {
  type?: string;
  field?: string;
}
export interface ResolversCompositionTransformObject {
  /**
   * The GraphQL Resolver path
   * Example: Query.users
   */
  resolver: string;
  /**
   * Path to the composer function
   * Example: ./src/auth.js#authComposer
   */
  composer:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
}
/**
 * Configuration for Snapshot extension
 */
export interface SnapshotTransformConfig {
  /**
   * Expression for when to activate this extension.
   * Value can be a valid JS expression string or a boolean (Any of: String, Boolean)
   */
  if?: string | boolean;
  /**
   * Resolver to be applied
   * For example;
   *   apply:
   *       - Query.* <- * will apply this extension to all fields of Query type
   *       - Mutation.someMutationButProbablyYouWontNeedIt
   */
  apply: string[];
  /**
   * Path to the directory of the generated snapshot files
   */
  outputDir: string;
  /**
   * Take snapshots by respecting the requested selection set.
   * This might be needed for the handlers like Postgraphile or OData that rely on the incoming GraphQL operation.
   */
  respectSelectionSet?: boolean;
}
export interface AdditionalStitchingResolverObject {
  type: string;
  field: string;
  requiredSelectionSet?: string;
  targetSource: string;
  targetMethod: string;
  args?: {
    [k: string]: unknown;
  };
  returnData?: string;
  resultSelectedFields?: {
    [k: string]: unknown;
  };
  resultSelectionSet?: string;
  resultDepth?: number;
}
export interface AdditionalSubscriptionObject {
  type: string;
  field: string;
  pubsubTopic: string;
  returnData?: string;
  filterBy?: string;
}
/**
 * Backend cache
 */
export interface Cache {
  file?: FileCacheConfig;
  inmemoryLRU?: InMemoryLRUConfig;
  localforage?: LocalforageConfig;
  redis?: RedisConfig;
  [k: string]: unknown;
}
export interface FileCacheConfig {
  path?: string;
}
export interface InMemoryLRUConfig {
  max?: number;
}
export interface LocalforageConfig {
  /**
   * Allowed values: WEBSQL, INDEXEDDB, LOCALSTORAGE
   */
  driver?: ('WEBSQL' | 'INDEXEDDB' | 'LOCALSTORAGE')[];
  name?: string;
  version?: number;
  size?: number;
  storeName?: string;
  description?: string;
}
export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
}
export interface PubSubConfig {
  name: string;
  config?:
    | {
        [k: string]: unknown;
      }
    | string
    | unknown[];
}
export interface LiveQueryInvalidation {
  field: string;
  invalidate: string[];
}
