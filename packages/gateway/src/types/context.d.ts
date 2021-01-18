import { CostData } from 'src/middleware/graphql-rate-limit/request-cost.tool';
import { Context } from '../server';

declare global {
  namespace Express {
    export interface Request {
      context: Context;
      id: string;
      costData: CostData;
    }
  }
}
