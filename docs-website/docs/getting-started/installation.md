---
id: installation
title: Installation
sidebar_label: Installation
---
### Prerequisites

Unless installed via docker compose, you will need:
* Redis – required by Gateway and Dashboard
* MongoDB - required by Dashboard only

### Docker Compose

Check out [our dedicated repository](https://github.com/graphql-portal/graphql-portal-docker) with docker compose files and examples of the configuration:
```shell
git clone git@github.com/graphql-portal/graphql-portal-docker.git
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
  -p 3030:3030 \
  -p 8080:8080 \
  gqlportal/dashboard:latest
```

You now should be able to open the configuration dashboard by going to http://localhost:8080 in your browser.

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
[Read more about the configuration of the gateway here.](/configuration/basic)

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
```json title="packages/backend/config/env/production.json"
{
  "gateway": {
    "secret": "@@DASHBOARD_SECRET"
  },
  "application": {
    "env": "production",
    "host": "@@HOST",
    "publicHost": "@@PUBLIC_HOST",
    "useSwaggerUi": false,
    "port": "@@DASHBOARD_PORT",
    "graphQL": {
      "playground": "@@GRAPHQL_PLAYGROUND",
      "debug": "@@GRAPHQL_PLAYGROUND"
    },
    "serveStatic": "false",
    "jwtSecret": "@@JWT_SECRET",
    "logLevel": "log",
    "maxmind": {
      "dbPath": "@@MAXMIND_DB_PATH",
      "licenseKey": "@@MAXMIND_LICENSE_KEY",
      "accountId": "@@MAXMIND_ACCOUNT_ID"
    },
    "sendgrid": {
      "senderEmail": "@@SENDGRID_SENDER_EMAIL",
      "confirmationTemplateId": "@@SENDGRID_CONFIRMATION_TEMPLATE",
      "resetPasswordTemplateId": "@@SENDGRID_RESET_PASSWORD_TEMPLATE",
      "apiKey": "@@SENDGRID_API_KEY"
    },
    "defaultAdmin": {
      "email": "@@DEFAULT_ADMIN_EMAIL",
      "password": "@@DEFAULT_ADMIN_PASSWORD"
    },
    "metrics": {
      "enabled": "@@METRICS_ENABLED",
      "chunk": "@@METRICS_CHUNK",
      "delay": "@@METRICS_DELAY"
    },
    "cryptoSecret": "@@CRYPTO_SECRET"
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

In that file, we have 3 main configuration variables which we have to specify:
* port – it is a port on which the dashboard application is going to be available;
* redis:connectionString – self-explicative, connection string for Redis
* mongodb:connectionString – connection string for Mongo.

Now, we have two choices: either we can pass these values as environment variables, or we can put them directly in the file.
In our current case, we will pass them as environment variables. Read more about [the configuration of the Gateway and
Dashboard here](/configuration/basic).

We can now launch the server:
```shell
# replace the following values with those relevant to your environment
DASHBOARD_PORT=8080 \
REDIS_CONNECTION_STRING="redis://localhost:6379" \
MONGODB_CONNECTION_STRING="mongodb://localhost:27017" \
NODE_ENV=production yarn start:prod
```

Once the server is launched, you can open the dashboard by going to http://localhost:8080.
