---
id: data-source-configuration
title: Data Source Configuration
sidebar_label: Data Source Configuration
---

GraphQL Portal is based on [GraphQL Mesh](http://graphql-mesh.com/) and uses it as a foundation for our own data sources.
Thus, at the moment there are two types of data sources available:
* Those provided by GraphQL Mesh
* Our custom ones (which we call _data connectors_ in the dashboard) and which quite often are inherited from various 
GraphQL Mesh data sources.

## Adding data sources to an API Definition

In order to add a data source to an API, you have to specify its filename in the `source_config_names` configuration option:
```json
{
  "name": "My First API",
  "endpoint": "/my-first-api",
  "source_config_names": ["my-data-source.yaml"]
}
```

:::info
Only the file name is required, the path is going to be resolved from the `sources_path` option in `gateway.json`.
:::

## Configuration of the data source

The data source configuration file can be either `json` or `yaml` and follows the [GraphQL Mesh format](https://graphql-mesh.com/docs)
(in Mesh terms they are called _input handlers_).

Each data source has the following format:
```yaml
name: MyDataSource
handler:
  handlerConfigurationObject:
```

where `handlerConfigurationObject` will depend on the data source.

For example, the simplest GraphQL proxy configuration would look like that:
```yaml
name: SimpleGraphQLProxy
handler:
  graphql:
    endpoint: https://some-test-graphql-service.com/graphql
```

[Read more about the available data sources and their configuration options](/getting-started/available-data-connectors).
