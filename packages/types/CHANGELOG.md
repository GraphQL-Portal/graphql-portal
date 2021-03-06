# @graphql-portal/types

## 1.2.0

### Minor Changes

- b39cc29: rejectUnauthorized field for connectors, patches
- 74ea83f: useEnv added boolean support, schema updated

## 1.1.4

### Patch Changes

- 8675fbb: fix ip-api definitions

## 1.1.3

### Patch Changes

- fe64eef: Custom handlers added to deps

## 1.1.2

### Patch Changes

- 2ad4780: Dependencies update

## 1.1.1

### Patch Changes

- 27bab9a: required fusion creator props fix

## 1.1.0

### Minor Changes

- c0894a9: Publish api def status

## 1.0.0

### Major Changes

- 1f920db: FusionCreator token changed to authorizationHeader, forward headers

## 0.27.1

### Patch Changes

- 7e8ff93: fusion fabric token moved to headers
- Updated dependencies [7e8ff93]
  - @graphql-portal/datasources@0.1.5

## 0.27.0

### Minor Changes

- 7040868: Added datadog tracing provider
- f68856c: webhooks, fusion fabric data connectors, downgrade types

### Patch Changes

- Updated dependencies [f68856c]
  - @graphql-portal/datasources@0.1.3

## 0.26.0

### Minor Changes

- 1ea95f9: sync mesh types

## 0.25.0

### Minor Changes

- 5ed49bc: add config.gateway.tracer{host, port} to configure jaeger agent connection

## 0.24.0

### Minor Changes

- 51818a9: add Mutation.invalidateCache to control API

### Patch Changes

- Updated dependencies [51818a9]
  - @graphql-portal/datasources@0.1.2

## 0.23.2

### Patch Changes

- 3c899e8: added salesforce description

## 0.23.1

### Patch Changes

- 05c6ae2: update datasources dependency

## 0.23.0

### Minor Changes

- 737fc25: Redis log level

## 0.22.1

### Patch Changes

- 2efdce4: update dependencies

## 0.22.0

### Minor Changes

- e96c1d4: added log_filter to reduce the amount of debug level logs
- 6d198a7: fixed custom handlers validation, fixed patches

### Patch Changes

- Updated dependencies [6d198a7]
  - @graphql-portal/datasources@0.1.0

## 0.21.0

### Minor Changes

- ddd0595: added handler descriptions, fixed weatherbit and stripe

## 0.20.0

### Minor Changes

- a4cfd75: add slack handler, small fixes

## 0.19.0

### Minor Changes

- b931565: Redis transport

## 0.18.3

### Patch Changes

- 14461fb: sync config, print mesh error stack

## 0.18.2

### Patch Changes

- c50438b: fix config

## 0.18.1

### Patch Changes

- a8ffe38: fix ajv errors output and merge default config

## 0.18.0

### Minor Changes

- 20dc51d: zero and single file config

## 0.17.0

### Minor Changes

- 824f9f0: Add Datadog logger

### Patch Changes

- d1a6115: add mesh packages, fix cors.origin, add apiDef.mesh to dashboard query

## 0.16.2

### Patch Changes

- f36fa72: Fix generation of gateway config + minor logger enhancement

## 0.16.1

### Patch Changes

- 9c0aad8: Fix a strict validation mode error in ajv

## 0.16.0

### Minor Changes

- be1f437: apis_path, middleware_path, sources_path are required only when use_dashboard_configs is false

### Patch Changes

- 6341161: Upgrading AJV validator to version 7.x

## 0.15.0

### Minor Changes

- aeb892c: Add CORS documentation; servername config option; add servername, listenHostname and listenPort to ping

## 0.14.0

### Minor Changes

- d818162: Add CORS support

## 0.13.0

### Minor Changes

- 97068da: Add IP-API handler + fix error 500 in assign-request-id middleware

## 0.12.0

### Minor Changes

- 20cea17: Remove "secret" top-level configuration option from the gateway

## 0.11.0

### Minor Changes

- 998e57a: add apiDef.playground: boolean to config

## 0.10.1

### Patch Changes

- eb6ea42: fix getting config from the dashboard, fix api auth
- 4745bdd: added new data source

## 0.10.0

### Minor Changes

- 81e86d9: Updating types due to updates in @graphql-mesh/config

### Patch Changes

- 81e86d9: update dependencies

## 0.9.0

### Minor Changes

- 9138fda: api authentication key

## 0.8.0

### Minor Changes

- 94540a2: added custom datasources;

## 0.7.0

### Minor Changes

- d61e610: metric interfaces moved to types package
- 1c86dc9: request size and complexity rate limiting

## 0.6.0

### Minor Changes

- 069fb8e: multicore optimization

## 0.5.0

### Minor Changes

- e4c1915: Add a JSON logging format

## 0.4.0

### Minor Changes

- update apis by polling and ping

## 0.3.0

### Minor Changes

- support federated schema

## 0.2.0

### Minor Changes

- mesh source sync

## 0.1.0

### Minor Changes

- 3567aab: fixed naming, exported validation and types
- 69e304c: fix mesh source, remove old file
