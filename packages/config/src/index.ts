import { ApiDef, GatewayConfig } from '@graphql-portal/types';
import { logger } from '@graphql-portal/logger';
import { dashboard, initDashboard } from '@graphql-portal/dashboard';
import { loadApiDefs as loadApiDefsFromFs } from './apis.config';
import { loadConfig } from './gateway.config';

const config: {
  gateway: GatewayConfig;
  apis: ApiDef[];
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
    const loadedApiDefs = await dashboard.loadApiDefs();
    if (!(loadedApiDefs && loadedApiDefs.length)) {
      logger.info('APIs were not updated');
      return;
    }
    config.apis = loadedApiDefs;
  } else {
    config.apis = await loadApiDefsFromFs(config.gateway);
  }
}

export { config };
