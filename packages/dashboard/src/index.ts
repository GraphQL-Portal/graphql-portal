import { GatewayConfig } from '@graphql-portal/types';
import DashboardApi from './dashboard-api';

let dashboard: DashboardApi;

export function initDashboard(gatewayConfig: GatewayConfig): void {
  dashboard = dashboard ?? new DashboardApi(gatewayConfig);
}

export { dashboard };
