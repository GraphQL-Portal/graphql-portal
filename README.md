# GraphQL Portal Gateway

[![GraphQL Portal](https://raw.githubusercontent.com/code-store-platform/graphql-portal-docker/main/graphql-portal.gif)](https://www.graphql-portal.com/)

[![npm version](https://img.shields.io/npm/v/@graphql-portal/gateway?color=green)](https://www.npmjs.com/package/@graphql-portal/gateway)
![Test](https://github.com/code-store-platform/graphql-portal/workflows/Test/badge.svg)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcode-store-platform%2Fgraphql-portal.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcode-store-platform%2Fgraphql-portal?ref=badge_shield)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![from Paris with Love](https://img.shields.io/badge/from%20Paris%20with-%F0%9F%A4%8D-red)](https://shields.io/)

Converge all your data sources into One Graph with a configurable, distributed and open source GraphQL Gateway.

## Motivation

The GraphQL Community and Ecosystem are growing rapidly, and the goal of GraphQL Portal is to bring an API Gateway that 
is native to GraphQL. It is designed to be a simple and universal GraphQL Gateway for those who must mix legacy services
with new ones exposing GraphQL APIs, but also for those who already have GraphQL APIs and want to have a light gateway
that will bring more control and visibility to their APIs.

It is open source by choice, relies on existing open source tools by design, is extendable, scalable and configurable.
It can either be installed on-premises, or be used as a [SaaS Gateway](https://www.graphql-portal.com/) (coming soon).

Key facts and features:
* it is open source but is also available in a SaaS version (coming soon)
* written in TypeScript
* based on GraphQL Mesh and supports most of its input handlers
* provides its own data connectors in addition to those by Mesh
* is distributed and can easily be scaled
* can be configured via YAML/JSON files or via the interactive web-dashboard
* has built-in monitoring and analytics
* is extendable with custom middlewares.

## Table of contents

* [How it works](#how-it-works)
* [Getting started](#getting-started)
* [Installation](#installation)
  * [Docker Compose](#docker-compose)
  * [Standalone Docker containers](#standalone-docker-containers)
  * [Standalone Gateway without Docker](#standalone-gateway-without-docker)
  * [Standalone Dashboard without Docker](#standalone-dashboard-without-docker)
* [Use cases](#use-cases)
* [License compatibility](#license-compatibility)

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

## Quick Start

TL;DR? The quickest way to launch GraphQL Portal (with Gateway and Dashboard) locally, is to use our [Docker Compose file](https://github.com:code-store-platform/graphql-portal-docker):
```shell
git clone git@github.com:code-store-platform/graphql-portal-docker.git
cd graphql-portal-docker

docker-compose -f docker-compose.yml up
```

This will launch the Gateway, Dashboard, as well as Redis and MongoDB.

See below for other installation methods.

## Installation

### Docker Compose

Check out [our dedicated repository](https://github.com:code-store-platform/graphql-portal-docker) with docker compose files and examples of the configuration:
```shell
git clone git@github.com:code-store-platform/graphql-portal-docker.git
cd graphql-portal-docker

docker-compose -f docker-compose.yml up
```

### Standalone Docker containers

Install and launch the Gateway:
```shell
docker pull gqlportal/gateway:latest
```

Now that you have Docker image locally, you will need to prepare a basic configuration file.
You may download a sample config:
```shell
curl -s -o ./gateway.yaml https://raw.githubusercontent.com/code-store-platform/graphql-portal-docker/main/basic.gateway.yaml
```

Once that is done, you can now launch the Gateway in a standalone mode:
```shell
docker run --name graphql-gateway \
  -p 3000:3000 \
  -v $(pwd)/gateway.yaml:/opt/graphql-portal/config/gateway.yaml
  gqlportal/gateway:latest
```


### Standalone Gateway without Docker

The Gateway can be installed either via npm/yarn, or by pulling this repository and then building the source codes.

#### Install via Yarn/NPM

The package `@graphql-portal/gateway` provides a CLI command `graphql-portal` which will start the server.
However, in order for the server to start correctly, we should first create (or download) a configuration file. By 
default, GraphQL Portal will search for a configuration in `./config/gateway.json|yaml` file. That's why, prior to 
launching the gateway, you may want to create a directory and place a config file into it. You can use a [basic configuration
file](https://raw.githubusercontent.com/code-store-platform/graphql-portal-docker/main/basic.gateway.yaml) 
from our [examples repository here](https://github.com/code-store-platform/graphql-portal-docker).

```shell
# create directories for configuration
mkdir -p /opt/graphql-portal/config

cd /opt/graphql-portal

# download a basic configuration file
curl -s -o ./config/gateway.yaml https://raw.githubusercontent.com/code-store-platform/graphql-portal-docker/main/basic.gateway.yaml
```

Now that the configuration is in place, we can install and launch the gateway.

```shell
# install the gateway and go to the directory with configuration
yarn global add @graphql-portal/gateway
cd /opt/graphql-portal

# @graphql-portal/gateway package provides a CLI command graphql-portal
graphql-portal
```

### Standalone Dashboard without Docker

_Coming soon_

## Use cases

_Coming soon_

## License compatibility

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcode-store-platform%2Fgraphql-portal.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcode-store-platform%2Fgraphql-portal?ref=badge_large)
