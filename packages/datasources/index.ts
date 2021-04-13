import * as contentful from './contentful';
import * as crunchbase from './crunchbase';
import * as ipApi from './ip-api';
import * as salesforce from './salesforce';
import * as slack from './slack';
import * as stripe from './stripe';
import * as twitter from './twitter';
import * as weatherbit from './weatherbit';

type Validate = (name: string, config: any) => string | void;
type CustomHandler = {
  handler: any;
  definitions: { [key: string]: any };
  packageName: string;
  validate?: Validate;
};

const handlers: CustomHandler[] = [contentful, slack, stripe, weatherbit, crunchbase, salesforce, twitter, ipApi];

const definitions: { [key: string]: any } = handlers.reduce(
  (result, handler) => ({ ...result, ...handler.definitions }),
  {}
);

const packageHandler: { [key: string]: string } = handlers.reduce(
  (result, handler) => ({ ...result, [handler.packageName]: handler.handler.name }),
  {}
);

const packageValidation: { [key: string]: Validate } = handlers.reduce(
  (result, handler) => ({ ...result, [handler.packageName]: handler.validate }),
  {}
);

export { definitions, packageHandler, packageValidation };
