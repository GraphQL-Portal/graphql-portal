import { Request } from 'express';
import { redis } from '../../redis';

export type CostData = Readonly<{
  id: string;
  ip: string;
  cost: number;
  body: Object;
}>;

export default class RequestCostTool {
  private costTable = 'queryCost';

  public constructor(private costExpirationInSeconds: number) {}

  public async saveCost(request: Request, cost: number): Promise<void> {
    const { body, ip, id } = request;
    body.query = body.query.replace(/\s+/g, ' ');
    const costData = {
      id,
      ip,
      cost,
      body,
    };
    const key = this.tableCostForUser(costData.ip, costData.id);
    await redis.set(key, JSON.stringify(costData));
    await redis.expire(key, this.costExpirationInSeconds);
  }

  public async getTotalCost(request: Request): Promise<number> {
    const keys = await redis.keys(this.tableCostForUser(request.ip, '*'));
    if (!keys?.length) return 0;

    const costs = (await redis.mget(keys)).filter(Boolean) as string[];
    if (!costs?.length) return 0;

    return costs.map(costJson => JSON.parse(costJson)).reduce((total, { cost }: CostData) => total + cost, 0);
  }

  private tableCostForUser(ip: string, id: string): string {
    return `${this.costTable}:${ip}:${id}`;
  }
}
