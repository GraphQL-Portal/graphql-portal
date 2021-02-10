---
id: available-data-connectors
title: Data Connectors
sidebar_label: Data Connectors
---
Under the hood, GraphQL Portal is using [GraphQL Mesh input handlers](https://graphql-mesh.com/docs)
as the base of its data connectors. Thus, there are two types of data connectors (or data sources) available:
1. Those provided by GraphQL Mesh
2. Custom data connectors provided by GraphQL Portal.

## List of GraphQL Mesh connectors

![GraphQL Mesh Logo](/img/mesh-logo.png)

At the moment, the following connectors (or _input handlers_) are available:
* [GraphQL](https://graphql-mesh.com/docs/handlers/graphql)
* [OpenAPI / Swagger](https://graphql-mesh.com/docs/handlers/openapi)
* [gRPC](https://graphql-mesh.com/docs/handlers/grpc)
* [JSON Schema](https://graphql-mesh.com/docs/handlers/json-schema)
* [PostgresSQL / PostGraphile](https://graphql-mesh.com/docs/handlers/postgraphile)
* [SOAP](https://graphql-mesh.com/docs/handlers/soap)
* [MongoDB / Mongoose](https://graphql-mesh.com/docs/handlers/mongoose)
* [OData / Microsoft Graph](https://graphql-mesh.com/docs/handlers/odata)
* [Apache Thrift](https://graphql-mesh.com/docs/handlers/thrift)
* [SQLite / Tuql](https://graphql-mesh.com/docs/handlers/tuql)
* [MySQL](https://graphql-mesh.com/docs/handlers/mysql)
* [Neo4j](https://graphql-mesh.com/docs/handlers/neo4j)

## List of custom data connectors

While Mesh connectors already provide the access nearly to all data sources, you still have to describe and maintain them.
In our vision, the goal of GraphQL Portal is to simplify the interaction with data scattered across many APIs. That's why,
we think that everything you have to do in order to access your data via a GraphQL API is to choose a connector and 
enter the connection details (auth keys or headers, logins or passwords).

### Slack
### Contentful
### Crunchbase
### Fedex
### Salesforce
### Stripe
### Twitter
### Weatherbit
