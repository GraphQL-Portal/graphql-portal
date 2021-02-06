---
id: basic
title: Basic configuration
sidebar_label: Basic Configuration
---
GraphQL Portal consists of two main components: Gateway and Dashboard.
Respectively, there are two ways how we can configure the Gateway:
* with a help of static files (JSON or YAML)
* or with a Dashboard (in that case static files will be ignored even if present).

## Configuring Gateway without dashboard

Main configuration file of the Gateway is `gateway.json|yaml`, which should look like following:
```json title="config/gateway.json"
{
  "hostname": "localhost",
  "listen_port": 3000,
  "pool_size": 1,
  "secret": "",
  "apis_path": "config/apidefs",
  "sources_path": "config/datasources",
  "middleware_path": "config/middlewares",
  "redis_connection_string": "redis://localhost:6379",
  "use_dashboard_configs": false,
  "enable_control_api": false,
  "log_level": "debug"
}
```

All the options above are required, see [Gateway config reference](/configuration/gateway-options) for a full list of options.

:::info Important
The configuration must be located in `config/gateway.json|yaml`, which should be 
relative to the directory in which we launch the gateway. 

It means that if we launch `graphql-portal` in `/opt/graphql-portal` then we 
will look for configuration file in `/opt/graphql-portal/config/gateway.json|yaml`).
:::

## Configuring Gateway with dashboard
