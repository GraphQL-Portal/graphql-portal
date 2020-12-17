import { cosmiconfig } from 'cosmiconfig';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from './types/api.interface';
import { join } from 'path';
import { parse } from 'yaml';
import { readdir, readFile } from 'fs/promises';
import Ajv from 'ajv';
import { GatewayConfig } from './types/gateway-config';
import { ApiConfig } from './types/api-config';
import { SourceConfig } from './types/mesh-source-config';
import * as gatewaySchema from './types/gateway-schema.json';
import * as apiDefsSchema from './types/api-schema.json';
import * as sourceSchema from './types/mesh-source-schema.json';

export { GatewayConfig, ApiConfig, SourceConfig, ApiDef };

export interface Config {
  gateway: GatewayConfig;
  apiDefs: ApiDef[];
}

let config: Config;
const logger = prefixLogger('config');

// JSON-Schema definitions of configuration files

export async function loadGatewayConfig(): Promise<GatewayConfig | null> {
  logger.info('Loading main configuration file.');
  // find & parse config
  const explorer = cosmiconfig('gateway', {
    searchPlaces: ['config/gateway.json', 'config/gateway.yaml'],
  });

  const results = await explorer.search(process.cwd());
  if (results === null) {
    logger.error('gateway.json|yaml cannot be found.');
    return null;
  }

  const newConfig = results.config;

  if (!validateGatewayConfig(newConfig)) {
    return null;
  }

  config = config === undefined ? { gateway: newConfig, apiDefs: [] } : { gateway: newConfig, apiDefs: config.apiDefs };

  return config.gateway;
}

export async function loadAPIDefs(gatewayConfig: GatewayConfig): Promise<ApiDef[]> {
  const apiConfigsDir = join(process.cwd(), gatewayConfig.apis_path);
  const sourceConfigsDir = join(process.cwd(), gatewayConfig.sources_path);

  const fileNames = await readdir(apiConfigsDir);
  const apis = await Promise.all(
    fileNames.map(async (name) => {
      const apiPath = join(apiConfigsDir, name);
      const file = await readFile(apiPath, 'utf8');
      const apiConfig = parse(file);
      if (!validateApiConfig(apiConfig)) {
        throw new Error(`API configuration file is not valid: ${apiPath}`);
      }

      const sources = await Promise.all(
        apiConfig.source_config_names.map((configName) => loadSourceConfig(join(sourceConfigsDir, configName)))
      );
      return {
        ...apiConfig,
        sources,
      };
    })
  );

  config.apiDefs = apis;

  return config.apiDefs;
}

export function validateGatewayConfig(config: any): config is GatewayConfig {
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

export function validateSourceConfig(source: any): source is SourceConfig {
  const ajv = new Ajv();
  const validate = ajv.compile(sourceSchema);
  if (!validate(source)) {
    logger.error('Source configuration is not valid:');
    logger.error(
      ajv.errorsText(validate.errors, {
        dataVar: 'source',
      })
    );
    return false;
  }

  return true;
}

export async function loadSourceConfig(fileName: string): Promise<SourceConfig> {
  const file = await readFile(fileName, 'utf8');
  const sourceConfig = parse(file);
  if (!validateSourceConfig(sourceConfig)) {
    throw new Error(`Source configuration file is not valid: ${fileName}`);
  }
  return sourceConfig;
}

export function validateApiConfig(api: any): api is ApiConfig {
  const ajv = new Ajv();
  const validate = ajv.compile(apiDefsSchema);
  if (!validate(api)) {
    logger.error('Source configuration is not valid:');
    logger.error(
      ajv.errorsText(validate.errors, {
        dataVar: 'api',
      })
    );
    return false;
  }

  return true;
}
