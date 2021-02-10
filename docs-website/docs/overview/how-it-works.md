---
id: how-it-works
title: How it works
sidebar_label: How It Works
---
<p align="center">
  <img alt="GraphQL Portal Schema" src="/img/graphql-portal-schema.png" />
</p>

GraphQL Portal consists of two major components:
* Gateway – can be launched as 1 or more instances in 1 or more servers/containers/pods;
* Dashboard – a backend (NestJS) and frontend (React) application that connects with Gateway nodes and works as a
  configuration interface for Gateways.

We also plan on adding a GraphQL Registry in the future.

In a full-power mode, GraphQL Portal will require two more components: Redis and MongoDB.

Once installed and configured, the Gateway allows you to:
* connect to multiple sources of data, including existing GraphQL services, REST or gRPC APIs, databases, etc;
* combine these data sources into universal graphs and serve them from different endpoints;
* apply schema transformations if necessary, cache data;
* protect your APIs with authentication keys;
* gather metrics and analytics;
* configure custom notifications via webhooks (coming soon).
