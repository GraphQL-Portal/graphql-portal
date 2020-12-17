import Ajv from 'ajv';
import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { parse } from 'yaml';
import { prefixLogger } from '@graphql-portal/logger';
import { GatewayConfig, ApiConfig, SourceConfig, ApiDef, sourceSchema, apiDefsSchema } from '@graphql-portal/types';

const logger = prefixLogger('apiDefs-config');

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

export async function loadApiDefs(gatewayConfig: GatewayConfig): Promise<ApiDef[]> {
  const apiConfigsDir = join(process.cwd(), gatewayConfig.apis_path);
  const sourceConfigsDir = join(process.cwd(), gatewayConfig.sources_path);

  const fileNames = await readdir(apiConfigsDir);
  const apiDefs = await Promise.all(
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

  return apiDefs;
}
