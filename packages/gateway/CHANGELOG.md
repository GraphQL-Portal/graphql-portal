# @graphql-portal/gateway

## 0.22.0

### Minor Changes

- c0894a9: Publish api def status

### Patch Changes

- Updated dependencies [c0894a9]
  - @graphql-portal/types@1.1.0
  - @graphql-portal/logger@0.7.9

## 0.21.0

### Minor Changes

- 1f920db: FusionCreator token changed to authorizationHeader, forward headers

### Patch Changes

- Updated dependencies [1f920db]
  - @graphql-portal/types@1.0.0
  - @graphql-portal/config@0.11.7
  - @graphql-portal/dashboard@0.1.14
  - @graphql-portal/logger@0.7.8

## 0.20.1

### Patch Changes

- e96ef42: Update dependencies

## 0.20.0

### Minor Changes

- 7040868: Added datadog tracing provider
- f68856c: webhooks, fusion fabric data connectors, downgrade types

### Patch Changes

- Updated dependencies [7040868]
- Updated dependencies [f68856c]
  - @graphql-portal/types@0.27.0
  - @graphql-portal/config@0.11.6
  - @graphql-portal/dashboard@0.1.13
  - @graphql-portal/logger@0.7.6

## 0.19.1

### Patch Changes

- Updated dependencies [1ea95f9]
  - @graphql-portal/types@0.26.0
  - @graphql-portal/config@0.11.5
  - @graphql-portal/dashboard@0.1.12
  - @graphql-portal/logger@0.7.5

## 0.19.0

### Minor Changes

- 5ed49bc: add config.gateway.tracer{host, port} to configure jaeger agent connection

### Patch Changes

- Updated dependencies [5ed49bc]
  - @graphql-portal/types@0.25.0
  - @graphql-portal/config@0.11.4
  - @graphql-portal/dashboard@0.1.11
  - @graphql-portal/logger@0.7.4

## 0.18.0

### Minor Changes

- 51818a9: add Mutation.invalidateCache to control API

### Patch Changes

- Updated dependencies [51818a9]
  - @graphql-portal/types@0.24.0
  - @graphql-portal/config@0.11.3
  - @graphql-portal/dashboard@0.1.10
  - @graphql-portal/logger@0.7.3

## 0.17.5

### Patch Changes

- Updated dependencies [737fc25]
  - @graphql-portal/logger@0.7.0
  - @graphql-portal/types@0.23.0
  - @graphql-portal/config@0.11.2
  - @graphql-portal/dashboard@0.1.9

## 0.17.4

### Patch Changes

- 9f3b5cb: fix dependencies, add debug logs
- 4ee7c19: fix resolver methrics paths
- 8b6687c: fix metric emitter: push request ID when request is completed, emit all resolver data
- 7908242: update dependencies, don't emit empty and introspection metrics
- Updated dependencies [e96c1d4]
- Updated dependencies [6d198a7]
  - @graphql-portal/logger@0.6.0
  - @graphql-portal/types@0.22.0
  - @graphql-portal/config@0.11.1
  - @graphql-portal/dashboard@0.1.8

## 0.17.3

### Patch Changes

- Updated dependencies [ddd0595]
  - @graphql-portal/config@0.11.0
  - @graphql-portal/types@0.21.0
  - @graphql-portal/dashboard@0.1.7
  - @graphql-portal/logger@0.5.2

## 0.17.2

### Patch Changes

- 8dc327e: fix: register only one metric handler
- Updated dependencies [a4cfd75]
  - @graphql-portal/config@0.10.0
  - @graphql-portal/types@0.20.0
  - @graphql-portal/dashboard@0.1.6
  - @graphql-portal/logger@0.5.1

## 0.17.1

### Patch Changes

- c5701ab: emit metric with error
- c5701ab: skip rateLimitMiddleware for invalid queries

## 0.17.0

### Minor Changes

- b931565: Redis transport

### Patch Changes

- Updated dependencies [b931565]
  - @graphql-portal/logger@0.5.0
  - @graphql-portal/types@0.19.0
  - @graphql-portal/config@0.9.4
  - @graphql-portal/dashboard@0.1.5

## 0.16.4

### Patch Changes

- 14461fb: sync config, print mesh error stack
- 203e0ee: fix metrics request date
- Updated dependencies [14461fb]
  - @graphql-portal/types@0.18.3
  - @graphql-portal/logger@0.4.4

## 0.16.3

### Patch Changes

- Updated dependencies [20dc51d]
  - @graphql-portal/config@0.9.0
  - @graphql-portal/types@0.18.0
  - @graphql-portal/dashboard@0.1.4
  - @graphql-portal/logger@0.4.1

## 0.16.2

### Patch Changes

- 660f3a5: ping redis only from master

## 0.16.1

### Patch Changes

- d1a6115: add mesh packages, fix cors.origin, add apiDef.mesh to dashboard query
- Updated dependencies [824f9f0]
- Updated dependencies [d1a6115]
  - @graphql-portal/logger@0.4.0
  - @graphql-portal/types@0.17.0
  - @graphql-portal/dashboard@0.1.3
  - @graphql-portal/config@0.8.2

## 0.16.0

### Minor Changes

- 18c714a: export getMeshForApiDef from router

### Patch Changes

- f36fa72: Fix generation of gateway config + minor logger enhancement
- Updated dependencies [f36fa72]
  - @graphql-portal/config@0.8.1
  - @graphql-portal/logger@0.3.1
  - @graphql-portal/types@0.16.2

## 0.15.2

### Patch Changes

- 264981b: Fix config.gateway.enable_control_api option being ignored
- Updated dependencies [be1f437]
- Updated dependencies [6341161]
  - @graphql-portal/config@0.8.0
  - @graphql-portal/types@0.16.0
  - @graphql-portal/dashboard@0.1.1

## 0.15.1

### Patch Changes

- 68d8ad7: Fixing version string
- 68d8ad7: Fixing gateway version string

## 0.15.0

### Minor Changes

- aeb892c: Add CORS documentation; servername config option; add servername, listenHostname and listenPort to ping

### Patch Changes

- a35c888: Fixing gateway version string
- Updated dependencies [aeb892c]
  - @graphql-portal/dashboard@0.1.0
  - @graphql-portal/types@0.15.0
  - @graphql-portal/config@0.7.3

## 0.14.0

### Minor Changes

- d818162: Add CORS support

### Patch Changes

- Updated dependencies [d818162]
  - @graphql-portal/types@0.14.0
  - @graphql-portal/config@0.7.2
  - @graphql-portal/dashboard@0.0.16

## 0.13.0

### Minor Changes

- 97068da: Add IP-API handler + fix error 500 in assign-request-id middleware

### Patch Changes

- Updated dependencies [97068da]
  - @graphql-portal/types@0.13.0
  - @graphql-portal/config@0.7.1
  - @graphql-portal/dashboard@0.0.15

## 0.12.0

### Minor Changes

- 20cea17: Remove "secret" top-level configuration option from the gateway

### Patch Changes

- Updated dependencies [20cea17]
  - @graphql-portal/config@0.7.0
  - @graphql-portal/types@0.12.0
  - @graphql-portal/dashboard@0.0.14

## 0.11.0

### Minor Changes

- 998e57a: add apiDef.playground: boolean to config

### Patch Changes

- Updated dependencies [998e57a]
  - @graphql-portal/types@0.11.0
  - @graphql-portal/config@0.6.2
  - @graphql-portal/dashboard@0.0.13

## 0.10.1

### Patch Changes

- dfb1dc8: fix update config
- Updated dependencies [dfb1dc8]
  - @graphql-portal/config@0.6.1

## 0.10.0

### Minor Changes

- 2d282f5: Update peer dependencies

### Patch Changes

- eb6ea42: fix getting config from the dashboard, fix api auth
- Updated dependencies [eb6ea42]
- Updated dependencies [4745bdd]
  - @graphql-portal/config@0.6.0
  - @graphql-portal/dashboard@0.0.12
  - @graphql-portal/types@0.10.1

## 0.9.2

### Patch Changes

- 81e86d9: update dependencies
- Updated dependencies [81e86d9]
- Updated dependencies [81e86d9]
  - @graphql-portal/types@0.10.0
  - @graphql-portal/config@0.5.4
  - @graphql-portal/dashboard@0.0.11

## 0.9.1

### Patch Changes

- f7fbe6b: handle error mw added

## 0.9.0

### Minor Changes

- 9138fda: api authentication key

### Patch Changes

- Updated dependencies [9138fda]
  - @graphql-portal/types@0.9.0
  - @graphql-portal/config@0.5.3
  - @graphql-portal/dashboard@0.0.10

## 0.8.1

### Patch Changes

- Updated dependencies [94540a2]
  - @graphql-portal/types@0.8.0
  - @graphql-portal/config@0.5.2
  - @graphql-portal/dashboard@0.0.9

## 0.8.0

### Minor Changes

- 1c86dc9: request size and complexity rate limiting

### Patch Changes

- d61e610: metric interfaces moved to types package
- Updated dependencies [d61e610]
- Updated dependencies [1c86dc9]
  - @graphql-portal/types@0.7.0
  - @graphql-portal/config@0.5.1
  - @graphql-portal/dashboard@0.0.8

## 0.7.0

### Minor Changes

- 8289cc8: Add Dockerfile
- dc27048: Metrics

## 0.6.0

### Minor Changes

- 069fb8e: multicore optimization

### Patch Changes

- 25bdeca: handle errors from custom MWs
- Updated dependencies [069fb8e]
  - @graphql-portal/config@0.5.0
  - @graphql-portal/logger@0.3.0
  - @graphql-portal/types@0.6.0
  - @graphql-portal/dashboard@0.0.7

## 0.5.0

### Minor Changes

- 4bbb4d7: Add hostname to ping request

### Patch Changes

- Updated dependencies [e4c1915]
  - @graphql-portal/logger@0.2.0
  - @graphql-portal/types@0.5.0
  - @graphql-portal/config@0.4.1
  - @graphql-portal/dashboard@0.0.6

## 0.4.0

### Minor Changes

- env vars in config, executable gateway

### Patch Changes

- Updated dependencies [undefined]
  - @graphql-portal/config@0.4.0

## 0.3.0

### Minor Changes

- update apis by polling and ping

### Patch Changes

- Updated dependencies [undefined]
  - @graphql-portal/config@0.3.0
  - @graphql-portal/logger@0.1.0
  - @graphql-portal/types@0.4.0
  - @graphql-portal/dashboard@0.0.5

## 0.2.0

### Minor Changes

- support federated schema

### Patch Changes

- Updated dependencies [undefined]
  - @graphql-portal/config@0.2.0
  - @graphql-portal/types@0.3.0
  - @graphql-portal/dashboard@0.0.4

## 0.1.2

### Patch Changes

- f97eb9a: fixed config loading, added tests
- Updated dependencies [f97eb9a]
  - @graphql-portal/config@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [undefined]
  - @graphql-portal/types@0.2.0
  - @graphql-portal/config@0.1.1
  - @graphql-portal/dashboard@0.0.3

## 0.1.0

### Minor Changes

- 3567aab: fixed naming, exported validation and types

### Patch Changes

- Updated dependencies [3567aab]
- Updated dependencies [69e304c]
  - @graphql-portal/config@0.1.0
  - @graphql-portal/types@0.1.0
  - @graphql-portal/dashboard@0.0.2
