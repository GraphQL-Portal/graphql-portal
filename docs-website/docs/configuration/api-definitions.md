---
id: api-definitions
title: GraphQL API Definitions
sidebar_label: GraphQL API Definitions
---
When _not_ using Dashboard for configuration, the API Definitions are going to be read from the `apis_path` specified in
`gateway.json`.

Each file in that directory (either `json` or `yaml`) represents a GraphQL API, which in turn may have 1 or more data sources.

## Configuration options

The only required options of the file are `name` (name of the API) and `endpoint` (on which endpoint is it going to 
be available):
```json title="config/apidefs/my-first-api.json"
{
  "name": "My First API",
  "endpoint": "/my-first-api"
}
```
:::note
In fact, a GraphQL API can have 0 data sources but... that doesn't make a lot of sense in practice.
:::

In order to add the data-sources to our API we have to specify the `source_config_names` option:
```json title="config/apidefs/my-first-api.json"
{
  "name": "My First API",
  "endpoint": "/my-first-api",
  "source_config_names": ["my-data-source.yaml"]
}
```
:::info
Only the file name is required, the path is going to be resolved from the `sources_path` option in `gateway.json`.
:::

[Read more about configuration of data sources](/configuration/data-source-configuration).

Below is the list of all available configuration options.

## name

Name of the API. It is mainly used for logging purposes.

## endpoint

A unique endpoint of this API. Should start with "/".

## source_config_names

Optional. Contains a list of filenames (with `json` or `yaml` extension) of data-sources which should be included into
the API.

## schema_polling_interval

Optional. Type of value – number. When set to a number bigger than 0, it will rebuild the GraphQL Schema of the API in the specified intervals
(in milliseconds).

This can be used to rebuild (in regular intervals) the federated schema for the underlying microservices. If during the 
rebuild phase at least one of the data-sources returned an error, the schema is not going to be rebuilt, and the old 
schema will continue to be served on the endpoint.

## schema_updates_through_control_api

Optional. Boolean. Defaults to `false`. When enabled, allows the rebuilding of the schema via control api.

## enable_ip_filtering

Optional. Boolean. Defaults to false. When enabled, switches on the IP Filtering middleware which is configured in a 
way of _allow_ips_ and _deny_ips_ lists.

:::caution
`allow_ips` list has a priority over the `deny_ips` list. It means, that if both lists are specified in the configuration,
then only `allow_ips` values are going to be used.
:::

Examples of configuration:
```json title="Allow a single IP"
{
  "enable_ip_filtering": true,
  "allow_ips": ["127.0.0.1"]
}
```
```json title="Deny a range of IPs"
{
  "enable_ip_filtering": true,
  "deny_ips": ["10.0.0.0/8"]
}
```
```json title="Specify both allow and deny, allow will always take precedence and deny will be ignored"
{
  "enable_ip_filtering": true,
  "allow_ips": ["10.0.0.1"],
  "deny_ips": ["10.0.0.0/8"]
}
```

## request_size_limit

Optional. This value specifies an HTTP Request size limit for a particular API Definition. Accepts numeric (in bytes) or string
values. When string is used, the following abbreviations are used:
* b for bytes
* kb for kilobytes
* mb for megabytes
* gb for gigabytes
* tb for terabytes
* pb for petabytes.

## depth_limit

Optional. Numeric value that specifies a maximum query depth limit for a given API Definition.
Default value is 10.

## request_complexity_limit

Optional. Numeric value that specifies a maximum complexity for a request. Defaults to 1000.

## rate_limit

Optional. An object with two settings: `complexity`, which specifies a total request complexity and `per`, which stands
for a rolling time window in seconds.

Example of a configuration:
```json
{
  "rate_limit": {
    "complexity": 10000,
    "per": 3600
  }
}
``` 

## authentication

Optional. An object with two fields:
* `auth_header_name` – name of the header from which the authentication token is going to be extracted;
* `auth_tokens` – an array of strings that correspond to token names.
  
:::caution
Due to security reasons we do not recommend specifying `auth_tokens` directly in the configuration file but rather pass
them through the environment variables by setting `auth_tokens` to `@@AUTH_TOKENS`.
:::
