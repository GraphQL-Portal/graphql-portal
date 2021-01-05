import { ApiDef, GatewayConfig } from '@graphql-portal/types';
import { prefixLogger } from '@graphql-portal/logger';
import { dashboard, initDashboard } from '@graphql-portal/dashboard';
import { loadApiDefs as loadApiDefsFromFs } from './api-def.config';
import { loadConfig } from './gateway.config';
import useEnv from './use-env';

const logger = prefixLogger('config');

const config: {
  gateway: GatewayConfig;
  apiDefs: ApiDef[];
  timestamp: number;
} = {} as any;

export async function initConfig() {
  config.gateway = (await loadConfig()) as GatewayConfig;
  useEnv(config.gateway);
}

export async function loadApiDefs() {
  if (!config.gateway) {
    return;
  }

  config.apiDefs = config.apiDefs ?? [];

  if (config.gateway.use_dashboard_configs) {
    initDashboard(config.gateway);
    const loaded = await dashboard.loadApiDefs();

    if (!(loaded && loaded?.apiDefs?.length)) {
      logger.info('API Definitions were not updated from Dashboard.');
      return;
    }

    config.apiDefs = loaded.apiDefs;
    config.timestamp = +loaded.timestamp;
  } else {
    config.apiDefs = await loadApiDefsFromFs(config.gateway);
    config.timestamp = Date.now();
    useEnv(config.apiDefs);
  }
}

export { config };
