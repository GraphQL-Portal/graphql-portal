import { cosmiconfig } from 'cosmiconfig';
import Ajv from 'ajv';
import { GatewayConfig } from './types/gateway-config';
import { prefixLogger } from './logger';

const gatewaySchema = require('../../src/types/gateway-schema.json');
const logger = prefixLogger('gateway-config');

export function validateConfig(config: any): config is GatewayConfig {
  const ajv = new Ajv();
  const validate = ajv.compile(gatewaySchema);
  if (!validate(config)) {
    logger.error('GraphQL Portal configuration is not valid:');
    logger.error(
      ajv.errorsText(validate.errors, {
        dataVar: 'config',
      })
    );
    return false;
  }

  return true;
}

export async function loadConfig(): Promise<GatewayConfig | null> {
  logger.info('Loading main configuration file.');
  // find & parse config
  const explorer = cosmiconfig('gateway', {
    searchPlaces: ['config/gateway.json', 'config/gateway.yaml'],
  });

  const results = await explorer.search();
  if (results === null) {
    logger.error('gateway.json|yaml cannot be found.');
    return null;
  }

  const config = results.config;

  // validate with AJV
  if (!validateConfig(config)) {
    return null;
  }

  return config;
}
