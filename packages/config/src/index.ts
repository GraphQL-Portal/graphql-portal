import { ApiDef, GatewayConfig } from '@graphql-portal/types';
import { logger } from '@graphql-portal/logger';
import { dashboard, initDashboard } from '@graphql-portal/dashboard';
import { loadApis as loadApisFromFs } from './apis.config';
import { loadConfig } from './gateway.config';

const config: {
  gateway: GatewayConfig;
  apis: ApiDef[];
} = {} as any;

export async function initConfig() {
  config.gateway = (await loadConfig()) as GatewayConfig;
}

export async function loadApis() {
  if (!config.gateway) {
    return;
  }
  initDashboard(config.gateway);
  if (config.gateway.use_dashboard_configs) {
    const loadedApis = await dashboard.loadApis();
    if (!(loadedApis && loadedApis.length)) {
      logger.info('APIs were not updated');
      return;
    }
    config.apis = loadedApis;
  } else {
    config.apis = await loadApisFromFs(config.gateway);
  }
}

export { config };
