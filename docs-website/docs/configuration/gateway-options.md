---
id: gateway-options
title: Gateway configuration options
sidebar_label: Gateway Config Options
---
## Gateway Configuration File

GraphQL Portal Gateway server is configured from `gateway.json|yaml` file which should be located in a directory `./config`
relative to the command.

For example, if we are launching `graphql-portal` command from `/opt/graphql-portal` directory, then the gateway configuration
should be located in `/opt/graphql-portal/config/gateway.json|yaml`.

## API Configuration Files

It is possible to use the gateway with static configuration files, in that case you have to set `use_dashboard_configs`
to `false`.

When done so, the gateway will try to load API Configurations from the directories specified in the following options:
* apis_path
* middleware_path
* sources_path.

:::info Important
In all of the above options, the path is relative to the directory in which we launch the gateway, i.e. if we are launching
the server in `/opt/graphql-portal` and the `apis_path` is set to `config/apis`, then we'll look for the files in 
`/opt/graphql-portal/config/apis/` directory.
:::

The combination of these options allows us to have a flexible configuration structure with separation of concerns,
which if necessary can then be versioned. Here is an example of a typical configuration structure:
```json title="config/gateway.json"
{
  "use_dashboard_configs": false,
  "apis_path": "config/apidefs",
  "middleware_path": "config/middlewares",
  "sources_path": "config/sources"
}
```
Our directory listing will then look like that:
```text
$ tree config/
config
├── apidefs
│   └── test-api.json
├── datasources
│   └── test-data-source.yaml
├── gateway.json
└── middlewares
```

## Environment variables

It is possible to override certain configuration options by using environment variables. To do that, you'll have to replace
the values of the variables in the configuration file with `@@ENV_VARIABLE_NAME`.

For example, lets take the following configuration file:
```json title="gateway.json" {2,3,12}
{
  "hostname": "@@HOSTNAME",
  "listen_port": @@PORT,
  "pool_size": 1,
  "secret": "",
  "apis_path": "config/apidefs",
  "sources_path": "config/datasources",
  "middleware_path": "config/middlewares",
  "redis_connection_string": "redis://localhost:6379",
  "use_dashboard_configs": false,
  "enable_control_api": false,
  "log_level": "@@LOG_LEVEL"
}
```

As you can see, there are three values which were replaced with `@@VARIABLE`. Values which were specified in that way are 
going to be taken from the environment variables.

## hostname

The hostname to bind the gateway node to.

## listen_port

The port on which GraphQL Portal Gateway will listen for the incoming connections.

## servername

Optional string. This value should be set to the external server name when gateway is used behind the load-balancer 
proxy.

## pool_size

The size of the NodeJS Cluster pool, i.e. how many instances of the gateway are going to be launched on the same host.
It is recommended to keep this number equal to the number of CPU cores on the machine. Setting this value to 1 will 
launch a single-instance gateway.

## use_dashboard_configs

This boolean value specifies whether to read the API configurations from the local file or from a GraphQL Portal Dashboard.

If set to `false`, the gateway will try to read the configuration files locally and will search for them in the locations
specified in the following configuration options:
* apis_path 
* middleware_path
* sources_path.

If set to `true`, it will try to connect to dashboard (see below for dashboard configuration) and get the configuration 
from there.

### dashboard_config

Optional. This value will be used only when `use_dashboard_configs` is set to `true`.

It contains a required options `connection_string`, which specifies the URL and connection parameters to the Dashboard.
Example:
```json
{
  "use_dashboard_configs": true,
  "dashboard_config": {
    "connection_string": "http://graphql-portal-dashboard.svc.local:8080"
  }
}
```

## apis_path

Path to a directory with API definition files. Read more about [API Configuration Files here](#api-configuration-files).

## middleware_path

Path to a directory with custom middlewares. [API Configuration Files here](#api-configuration-files)

## sources_path

Path to a directory with data source files. [API Configuration Files here](#api-configuration-files)

## enable_control_api

Enables or disables the Control API which is used to update GraphQL Schema definitions.

### control_api_config

Optional. Used only when `enable_control_api` is set to `true`. Contains only one property `endpoint` which specifies 
the URL path on which to which the Control API will be bind.
```json
{
  "enable_control_api": true,
  "control_api_config": {
    "endpoint": "/control-api"
  }
}
```

## cors

Optional. Enables and configures CORS requests.
CORS requests from Dashboard are enabled by default when `use_dashboard_configs` is set to true.

### enabled

Boolean, `false` by default. Enables CORS configuration.

### origins

Array of strings. Configures the Access-Control-Allow-Origin CORS header. Expects an Array of valid origins.

### methods

Array of strings. Configures the Access-Control-Allow-Methods CORS header. Expects an array of HTTP Methods.

### allowedHeaders

Array of strings. Configures the Access-Control-Allow-Headers CORS header. Expects and Array of headers.

### exposedHeaders

Array of strings. Configures the Access-Control-Expose-Headers CORS header.

### credentials

Array of strings. Configures the Access-Control-Allow-Credentials CORS header.

### maxAge

Integer. Configures the Access-Control-Max-Age CORS header.

### optionsSuccessStatus

Integer. Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) 
choke on 204.

## metrics

Optional. Enables metrics gathering. Disabled by default.
```json
{
  "metrics": {
    "enabled": false
  }
}
```

## log_format

Optional. Can be `text` or `json`. Default value is `text`.

## log_level

Possible values are: 'debug' | 'info' | 'warn' | 'error'.

## datadog_logging

Configures sending of log messages to Datadog.

### enabled

Boolean. Enable or disable logging to Datadog. Defaults to false.

### apiKey

String. Datadog API key of your application.

### host

String. Host of the Datadog TCP (TLS) intake. Defaults to the US server (_intake.logs.datadoghq.com_).

### port

Number. Port of the Datadog TCP (TLS) intake. Defaults to _10516_.

### environment

String. Adds an environment attribute to Datadog logs. Empty by default.

### tags

Array of strings. Allows transport level tagging in Datadog. Each tag should follow the format `<KEY>:<VALUE>`. For more information see https://docs.datadoghq.com/getting_started/tagging/.

## redis_connection_string

Connection string specifying access to a Redis instance, for example:
```json
{
  "redis_connection_string": "redis://localhost:6379"
}
```

## request_size_limit

Optional. Default value is 100kb. This value specifies an HTTP Request size limit. Accepts numeric (in bytes) or string 
values. When string is used, the following abbreviations are used:
* b for bytes
* kb for kilobytes
* mb for megabytes
* gb for gigabytes
* tb for terabytes
* pb for petabytes.

Example:
```json
{
  "request_size_limit": "20mb"
}
```
