# GraphQL Portal Gateway

[![GraphQL Portal](https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/graphql-portal.gif)](https://www.graphql-portal.com/)

[![npm version](https://img.shields.io/npm/v/@graphql-portal/gateway?color=green)](https://www.npmjs.com/package/@graphql-portal/gateway)
![Test](https://github.com/graphql-portal/graphql-portal/workflows/Test/badge.svg)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FGraphQL-Portal%2Fgraphql-portal.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FGraphQL-Portal%2Fgraphql-portal?ref=badge_shield)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![from Paris with Love](https://img.shields.io/badge/from%20Paris%20with-%F0%9F%A4%8D-red)](https://shields.io/)

Converge all your data sources into One Graph with a configurable, distributed and open source GraphQL Gateway.

## Motivation

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

## Table of contents

* [How it works](#how-it-works)
* [Quick Start](#quick-start)
* [Installation](#installation)
  * [Prerequisites](#prerequisites)
  * [Docker Compose](#docker-compose)
  * [Standalone Docker containers](#standalone-docker-containers)
  * [Standalone Gateway with Yarn/NPM](#standalone-gateway-with-yarnnpm)
  * [Standalone Dashboard without Docker](#standalone-dashboard-without-docker)
* [Configuration](#configuration)
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

TL;DR? The quickest way to launch GraphQL Portal (with Gateway and Dashboard) locally, is to use our [Docker Compose file](https://github.com/graphql-portal/graphql-portal-docker):
```shell
git clone git@github.com:GraphQL-Portal/graphql-portal-docker.git
cd graphql-portal-docker

docker-compose -f docker-compose.yml up
```

This will launch the Gateway, Dashboard, as well as Redis and MongoDB.

Where to go from here? We would suggest creating some APIs and playing with the data connectors.
[Read more about that here.](#configuration)

## Installation

### Prerequisites

Unless installed via docker compose, you will need:
* Redis – required by Gateway and Dashboard
* MongoDB - required by Dashboard only

### Docker Compose

Check out [our dedicated repository](https://github.com/graphql-portal/graphql-portal-docker) with docker compose files and examples of the configuration:
```shell
git clone git@github.com:GraphQL-Portal/graphql-portal-docker.git
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
curl -s -o ./gateway.yaml https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/basic.gateway.yaml
```

Once that is done, you can now launch the Gateway in a standalone mode (you may have to specify a Redis connection
string relevant to your local environment):
```shell
docker run --name graphql-gateway \
  -p 3000:3000 \
  -e REDIS="redis://localhost:6379" \
  -v $(pwd)/gateway.yaml:/opt/graphql-portal/config/gateway.yaml \
  gqlportal/gateway:latest
```

Install and launch Dashboard:
```shell
docker pull gqlportal/dashboard:latest

# Modify the connection strings depending on your environment
docker run --name graphql-dashboard \
  -e REDIS_CONNECTION_STRING="redis://localhost:6379" \
  -e MONGODB_CONNECTION_STRING="mongodb://localhost:27017" \
  -e DASHBOARD_PORT=3030 \
  -e NODE_ENV=production \
  -p 3030:3030 \
  gqlportal/dashboard:latest
```

You now should be able to open the configuration dashboard by going to http://localhost:3030 in your browser.

### Standalone Gateway with Yarn/NPM

The Gateway can also be installed either via npm/yarn, or by pulling this repository and then building the source codes.

The package `@graphql-portal/gateway` provides a CLI command `graphql-portal` which will start the server.
However, in order for the server to start correctly, we should first create (or download) a configuration file. By
default, GraphQL Portal will search for a configuration in `./config/gateway.json|yaml` file. That's why, prior to
launching the gateway, you may want to create a directory and place a config file into it. You can use a [basic configuration
file](https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/basic.gateway.yaml)
from our [examples repository here](https://github.com/graphql-portal/graphql-portal-docker).

```shell
# create directories for configuration
mkdir -p /opt/graphql-portal/config && cd /opt/graphql-portal

# download a basic configuration file
curl -s -o ./config/gateway.yaml https://raw.githubusercontent.com/graphql-portal/graphql-portal-docker/main/basic.gateway.yaml
```

Now that the configuration is in place, we can install and launch the gateway:
```shell
# install the gateway and go to the directory with configuration
yarn global add @graphql-portal/gateway

# @graphql-portal/gateway package provides a CLI command graphql-portal
# we will also need a Redis connection string in order to launch the gateway
env REDIS="redis://localhost:6379" NODE_ENV=production graphql-portal
```

You should now see the output of the server without any errors.
[Read more about the configuration of the gateway here.](#configuration)

### Standalone Dashboard without Docker

At the moment, GraphQL Portal Dashboard consists from the following components:
* Backend (NestJS)
* Frontend (React),

and requires the following dependencies:
* MongoDB
* connection to Redis – same Redis used by Gateway.

It is not distributed via Yarn/NPM and can be installed locally by pulling and building the source code from the repository:
```shell
mkdir /opt/graphql-portal-dashboard
git clone https://github.com/graphql-portal/graphql-portal-dashboard /opt/graphql-portal-dashboard

cd /opt/graphql-portal-dashboard

# the following two steps can take some time
yarn install --frozen-lockfile
yarn build
```

We'll have to edit the configuration file before launching the server. To do that, open the configuration file for
_production_ environment:
```shell
vim packages/backend/config/env/production.json
```
```json
{
  "application": {
    "env": "production",
    "useSwaggerUi": false,
    "port": "@@DASHBOARD_PORT",
    "host": "@@HOST",
    "graphQL": {
      "playground": false,
      "debug": false
    },
    "logLevel": "log",
    "defaultAdmin": {
      "email": "@@DEFAULT_ADMIN_EMAIL",
      "password": "@@DEFAULT_ADMIN_PASSWORD"
    },
    "sendgrid": {
      "senderEmail": "@@SENDGRID_SENDER_EMAIL",
      "apiKey": "@@SENDGRID_API_KEY"
    },
    "mail": {
      "driver": "@@MAIL_DRIVER",
      "from": "@@MAIL_FROM",
      "sendgrid": {
        "apiKey": "@@SENDGRID_API_KEY"
      },
      "smtp": {
        "host": "@@SMTP_HOST",
        "port": "@@SMTP_PORT",
        "auth": {
          "user": "@@SMTP_USER",
          "pass": "@@SMTP_PASS",
        },
        "secure": "@@SMTP_SECURE",
      },
    },
    "metrics": {
      "enabled": "@@METRICS_ENABLED",
      "chunk": "@@METRICS_CHUNK",
      "delay": "@@METRICS_DELAY"
    },
    "maxmind": {
      "dbPath": "@@MAXMIND_DB_PATH",
      "licenseKey": "@@MAXMIND_LICENSE_KEY",
      "accountId": "@@MAXMIND_ACCOUNT_ID"
    }
  },
  "client": {
    "host": "@@CLIENT_HOST"
  },
  "db": {
    "redis": {
      "connectionString": "@@REDIS_CONNECTION_STRING"
    },
    "mongodb": {
      "connectionString": "@@MONGODB_CONNECTION_STRING"
    }
  }
}
```

In that file, we have 5 main configuration variables which we have to specify:
* port – it is a port on which the dashboard application is going to be available.
* redis:connectionString – self-explicative, connection string for Redis.
* mongodb:connectionString – connection string for Mongo.
* defaultAdmin:email – default admin email.
* defaultAdmin:password – default admin password.

Now, we have two choices: either we can pass these values as environment variables, or we can put them directly in the file.
In our current case, we will pass them as environment variables. Read more about [the configuration of the Gateway and
Dashboard here](#configuration).

We can now launch the server:
```shell
# replace the following values with those relevant to your environment
DASHBOARD_PORT=8080 \
REDIS_CONNECTION_STRING="redis://localhost:6379" \
MONGODB_CONNECTION_STRING="mongodb://localhost:27017" \
DEFAULT_ADMIN_EMAIL="your_email" \
DEFAULT_ADMIN_PASSWORD="your_password" \
NODE_ENV=production yarn start:prod
```

Once the server is launched, you can open the dashboard by going to http://localhost:8080 and login via admin credentials.


## Authentication
You can use `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` for sign-in as admin or create a new account manually with "user" role.
By default users do not receive email with reset password instructions or sign-up confimation, you are able to see them only in your application logs.

Provide corresponding environment variables for enabling one of mail services.
Sendgrid example:
```shell
# replace the following values with those relevant to your environment and sendgrid account
MAIL_DRIVER="sendgrid" \
MAIL_FROM="no-reply@example.com" \
SENDGRID_API_KEY="your_api_key" \
PUBLIC_HOST="dashboard_public_host" \
CLIENT_HOST="dashboard_frontend_host" \
```
SMTP example:
```shell
# replace the following values with those relevant to your environment and smtp configuration
MAIL_DRIVER="smtp" \
MAIL_FROM="no-reply@example.com" \
SMTP_HOST="smtp_host" \
SMTP_PORT="smtp_port" \
SMTP_USER="smtp_user" \
SMTP_PASS="smtp_pass" \
SMTP_SECURE="smtp_secure" \
PUBLIC_HOST="dashboard_public_host" \
CLIENT_HOST="dashboard_frontend_host" \
```

## Sendgrid [DEPRECATED]. Use `Mail` config option instead
* sendgrid:senderEmail – The email address of the sender. All email addresses can be plain ‘sender@server.com’. 
* sendgrid:apiKey – Sendgrid API Key.

## Mail
* mail:from – The email address of the sender. All email addresses can be plain ‘sender@server.com’. 
* mail:driver – The driver property defines the default driver to use for sending emails. Should be equal to `smtp` or `sendgrd`.
* mail:sendgrid – Sendgrid driver config options.
* mail:smtp – Sendgrid driver config options.

### Sendgrid
* mail:sendgrid:apiKey – Sendgrid API Key.

### SMTP
* mail:smtp:host - is the hostname or IP address to connect to (defaults to "smtp.sendgrid.net").
* mail:smtp:port - is the port to connect to (defaults to "587").
* mail:smtp:secure - if true the connection will use TLS when connecting to server. If false (the default) then TLS is used if server supports the STARTTLS extension. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false.
* mail:smtp:auth:user - is the username (defaults to "apikey").
* mail:smtp:auth:pass - is the password for the user (defaults to "SG.example").

## Metrics
* metrics:enabled – enable metrics recording to mongo; (default = true).
* metrics:chunk – count of records that will be read per 1 iteration (default = 100).
* metrics:delay – delay between recording iterations in ms (default = 5000).

###### If you want to enable geo data in request metrics specify `maxmind:dbPath` for using local mmdb database file or `maxmind:licenseKey` **and** `maxmind:accountId` for WebServiceClient
* maxmind:dbPath – path to the binary mmdb database file.
* maxmind:licenseKey – maxmind license key, used to authorize access to query maxmind web services and download databases.
* maxmind:accountId – maxmind account id.

```shell
METRICS_ENABLED="true" \
METRICS_CHUNK="100" \
METRICS_DELAY="5000" \
MAXMIND_DB_PATH="db_path" \
MAXMIND_LICENSE_KEY="license_key" \
MAXMIND_ACCOUNT_ID="account_id" \
```

## Configuration

_Coming soon_

## Use cases

_Coming soon_

## License compatibility

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FGraphQL-Portal%2Fgraphql-portal.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FGraphQL-Portal%2Fgraphql-portal?ref=badge_large)
