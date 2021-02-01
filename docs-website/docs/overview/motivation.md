---
id: motivation
title: Motivation
sidebar_label: Motivation
slug: /
---
<p align="center">
    <img src="https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/graphql-portal.gif" />
</p>

The GraphQL Community and Ecosystem are growing rapidly, and the goal of GraphQL Portal is to bring an API Gateway that
is native to GraphQL. It is designed to be a simple and universal GraphQL Gateway for those who must mix legacy services
with new ones exposing GraphQL APIs, but also for those who already have GraphQL APIs and want to have a light gateway
that will bring more control and visibility to their APIs.

It is open source by choice, relies on existing open source tools by design, is extendable, scalable and configurable.
It can either be installed on-premises, or be used as a [SaaS Gateway](https://www.graphql-portal.com/) (_coming soon_).

Key facts and features:
* it is open source but is also available in a SaaS version (coming soon)
* written in TypeScript
* based on GraphQL Mesh and supports most of its input handlers
* provides its own data connectors in addition to those by Mesh
* is distributed and can easily be scaled
* can be configured via YAML/JSON files or via the interactive web-dashboard
* has built-in monitoring and analytics
* is extendable with custom middlewares.

## How it works

GraphQL Portal consists of two major components:
* Gateway – can be launched as 1 or more instances in 1 or more servers/containers/pods;
* Dashboard – a backend (NestJS) and frontend (React) application that connects with Gateway nodes and works as a
  configuration interface for Gateways.

We plan on adding a GraphQL Registry in the future.

In a full-power mode, GraphQL Portal will require two more components: Redis and MongoDB.

Once installed and configured, the Gateway allows you to:
* connect to multiple sources of data, including existing GraphQL services, REST or gRPC APIs, databases, etc;
* combine these data sources into universal graphs and serve them from different endpoints;
* apply schema transformations if necessary, cache data;
* protect your APIs with authentication keys;
* gather metrics and analytics;
* configure custom notifications via webhooks (coming soon).
