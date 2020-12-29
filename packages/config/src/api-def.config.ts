import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { parse } from 'yaml';
import { prefixLogger } from '@graphql-portal/logger';
import {
  GatewayConfig,
  ApiDefConfig,
  SourceConfig,
  ApiDef,
  validateSourceConfig,
  validateApiDefConfig,
} from '@graphql-portal/types';
import findWorkspaceRoot from 'find-yarn-workspace-root';

const logger = prefixLogger('apiDefs-config');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export function sourceConfigGuard(source: any): source is SourceConfig {
  const validateResult = validateSourceConfig(source);

  if (validateResult) {
    logger.error('Source configuration is not valid:');
    logger.error(validateResult);
    return false;
  }

  return true;
}

export async function loadSourceConfig(fileName: string): Promise<SourceConfig> {
  const file = await readFile(fileName, 'utf8');
  const sourceConfig = parse(file);
  if (!sourceConfigGuard(sourceConfig)) {
    throw new Error(`Source configuration file is not valid: ${fileName}`);
  }
  return sourceConfig;
}

export function apiDefConfigGuard(apiDef: any): apiDef is ApiDefConfig {
  const validateResult = validateApiDefConfig(apiDef);

  if (validateResult) {
    logger.error('Source configuration is not valid:');
    logger.error(validateResult);
    return false;
  }

  return true;
}

export async function loadApiDefs(gatewayConfig: GatewayConfig): Promise<ApiDef[]> {
  if (gatewayConfig.apis_path === '' || gatewayConfig.sources_path === '') {
    logger.warn('"apis_path" and "sources_path" cannot be empty, skipping loading of API Definitions.');
    return [];
  }

  const workspaceRoot: string =
    findWorkspaceRoot(process.cwd()) === null ? process.cwd() : (findWorkspaceRoot(process.cwd()) as string);
  const apiConfigsDir = join(workspaceRoot, gatewayConfig.apis_path);
  const sourceConfigsDir = join(workspaceRoot, gatewayConfig.sources_path);

  const fileNames = await readdir(apiConfigsDir);
  const apiDefs = await Promise.all(
    fileNames.map(async (name) => {
      const apiPath = join(apiConfigsDir, name);
      const file = await readFile(apiPath, 'utf8');
      const apiConfig = parse(file);
      if (!apiDefConfigGuard(apiConfig)) {
        throw new Error(`API configuration file is not valid: ${apiPath}`);
      }
      if (!apiConfig.source_config_names?.length) {
        throw new Error(`API should have some source_config_names: ${apiPath}`);
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
