import Ajv from 'ajv';
import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { parse } from 'yaml';
import { GatewayConfig } from './types/gateway-config';
import logger from './logger';
import { ApiConfig } from './types/api-config';
import { SourceConfig } from './types/mesh-source-config';
import { Api } from './types/api.interface';

const sourceSchema = require('../../src/types/mesh-source-schema.json');
const apiSchema = require('../../src/types/api-schema.json');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export function validateSourceConfig(source: any): source is SourceConfig {
  const ajv = new Ajv();
  const validate = ajv.compile(sourceSchema);
  if (!validate(source)) {
    logger.error('Source configuration is not valid:');
    logger.error(
      ajv.errorsText(validate.errors, {
        dataVar: 'source',
      }),
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
  const validate = ajv.compile(apiSchema);
  if (!validate(api)) {
    logger.error('Source configuration is not valid:');
    logger.error(
      ajv.errorsText(validate.errors, {
        dataVar: 'api',
      }),
    );
    return false;
  }

  return true;
}

export async function loadApis(gatewayConfig: GatewayConfig): Promise<Api[]> {
  const apiConfigsDir = join(process.cwd(), gatewayConfig.apis_path);
  const sourceConfigsDir = join(process.cwd(), gatewayConfig.sources_path);

  const fileNames = await readdir(apiConfigsDir);
  const apis = await Promise.all(fileNames.map(async (name) => {
    const apiPath = join(apiConfigsDir, name);
    const file = await readFile(apiPath, 'utf8');
    const apiConfig = parse(file);
    if (!validateApiConfig(apiConfig)) {
      throw new Error(`API configuration file is not valid: ${apiPath}`);
    }

    const sources = await Promise.all(
      apiConfig.source_config_names.map((configName) => loadSourceConfig(join(sourceConfigsDir, configName))),
    );
    return {
      ...apiConfig,
      sources,
    };
  }));

  return apis;
}
