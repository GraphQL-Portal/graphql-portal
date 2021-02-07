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

Below is the list of all available configuration options.

## name

Name of the API. It is mainly used for logging purposes.

## endpoint

A unique endpoint of this API. Should start with "/".

## source_config_names

Optional. Contains a list of filenames (with `json` or `yaml` extension) of data-sources which should be included into
the API.

## schema_polling_interval

Optional. When set to a number bigger than 0, it will rebuild the GraphQL Schema of the API in the specified intervals
(in milliseconds).

This can be used to rebuild (in regular intervals) the federated schema for the underlying microservices. If during the 
rebuild phase at least one of the data-sources returned an error, the schema is not going to be rebuilt, and the old 
schema will continue to be served on the endpoint.

schema_updates_through_control_api?: boolean;
enable_ip_filtering?: boolean;
allow_ips?: string[];
deny_ips?: string[];
/**
* Argument of the bytes package's method parse https://www.npmjs.com/package/bytes
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
  mesh?: {
