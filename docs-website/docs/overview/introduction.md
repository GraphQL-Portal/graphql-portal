---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /
---
<p align="center">
    <img alt="GraphQL Portal Logo animation" src="https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/graphql-portal.gif" />
</p>

GraphQL Portal is a single point of entry of your application to the data scattered across multiple APIs and other data sources.

The GraphQL Community and Ecosystem are growing rapidly, and the goal of GraphQL Portal is to bring an API Gateway that
is native to GraphQL. It is designed to be a simple and universal GraphQL Gateway for those who must mix legacy services
with new ones exposing GraphQL APIs, but also for those who already have GraphQL APIs and want to have a light gateway
that will bring more control and visibility to their APIs.

It is open source by choice, relies on existing open source tools by design, is extendable, scalable and configurable.
It can either be installed on-premises, or be used as a [SaaS Gateway](https://www.graphql-portal.com/) (_coming soon_).

Key facts and features:
* it is open source but is also available in a SaaS version (coming soon)
* written in TypeScript
* based on [GraphQL Mesh](https://graphql-mesh.com/) and supports most of its input handlers
* provides its own data connectors in addition to those by Mesh
* is distributed and can easily be scaled
* can be configured via YAML/JSON files or via the interactive web-dashboard
* has built-in monitoring and analytics
* is extendable with custom middlewares.
