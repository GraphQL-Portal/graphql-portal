import axios, { AxiosInstance } from 'axios';
import { ApiDef, GatewayConfig } from '@graphql-portal/types';
import { prefixLogger } from '@graphql-portal/logger';
import queries from './queries';

const graphqlRoute = 'graphql';
const logger = prefixLogger('dashboard-api');

export default class DashboardApi {
  private readonly http: AxiosInstance;
  private dashboardUrl = '';

  public constructor(gatewayConfig: GatewayConfig) {
    if (!gatewayConfig.dashboard_config?.connection_string) {
      logger.warn(`Cannot set url: "${gatewayConfig.dashboard_config?.connection_string}", dashboard is disabled`);
      return new Proxy(this, {
        get() {
          return (): void => undefined;
        },
      });
    }

    this.dashboardUrl = gatewayConfig.dashboard_config?.connection_string;
    logger.info(`Dashboard url ➜ ${this.dashboardUrl}`);
    this.http = axios.create({
      baseURL: this.dashboardUrl,
      headers: {
        authorization: gatewayConfig.dashboard_config.secret,
      },
    });
  }

  public async loadApiDefs(): Promise<{ apiDefs: ApiDef[]; timestamp: number } | void> {
    try {
      const { data } = await this.http.post(graphqlRoute, {
        query: queries.getAllApiDefsForGateway,
      });

      if (data.errors?.length) {
        throw new Error(data.errors[0].message);
      }

      logger.debug('Loaded API definitions from the dashboard');
      return data.data?.getAllApiDefsForGateway;
    } catch (error) {
      logger.error(`Failed to load API configs from the dashboard: ${error.message}`);
    }
  }
}
