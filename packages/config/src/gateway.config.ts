import { prefixLogger } from '@graphql-portal/logger';
import { GatewayConfig, gatewaySchema } from '@graphql-portal/types';
import Ajv from 'ajv';
import { cosmiconfig } from 'cosmiconfig';

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

  const explorer = cosmiconfig('gateway', {
    searchPlaces: ['config/gateway.json', 'config/gateway.yaml'],
  });
  const results = await explorer.search();
  let config: GatewayConfig;
  if (results) {
    config = results.config;
  } else {
    logger.warn('config/gateway.json|yaml cannot be found, default config will be used');
    config = {
      hostname: 'localhost',
      listen_port: 8080,
      apis_path: './config/apis',
      sources_path: './config/sources',
      use_dashboard_configs: false,
      enable_control_api: true,
      enable_metrics_recording: true,
      log_format: 'text',
      log_level: 'info',
      redis: {
        connection_string: 'redis://localhost:6379',
      },
      control_api_config: {
        endpoint: '/control_api',
      },
      cors: {
        enabled: false,
      },
    };
  }

  if (!validateConfig(config)) {
    return null;
  }
  return config;
}
