FROM node:14-alpine

LABEL Description="GraphQL Portal Gateway" Vendor="GraphQL Portal"

VOLUME ["/opt/graphql-portal"]
WORKDIR /opt/graphql-portal

RUN yarn global add @graphql-portal/gateway

ENV NODE_ENV production
EXPOSE 3000

CMD ["graphql-portal"]
