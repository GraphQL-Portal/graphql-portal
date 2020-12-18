import { ApiDef, GatewayConfig } from '@graphql-portal/types';
import { logger } from '@graphql-portal/logger';
import { dashboard, initDashboard } from '@graphql-portal/dashboard';
import { loadApiDefs as loadApiDefsFromFs } from './api-def.config';
import { loadConfig } from './gateway.config';

const config: {
  gateway: GatewayConfig;
  apiDefs: ApiDef[];
  timestamp: number;
} = {} as any;

export async function initConfig() {
  config.gateway = (await loadConfig()) as GatewayConfig;
}

export async function loadApiDefs() {
  if (!config.gateway) {
    return;
  }
  initDashboard(config.gateway);
  if (config.gateway.use_dashboard_configs) {
    const loaded = await dashboard.loadApiDefs();
    if (!(loaded && loaded?.apiDefs?.length)) {
      logger.info('APIs were not updated');
      return;
    }
    config.apiDefs = loaded.apiDefs;
    config.timestamp = +loaded.timestamp;
  } else {
    config.apiDefs = await loadApiDefsFromFs(config.gateway);
    config.timestamp = Date.now();
  }
}

export { config };
