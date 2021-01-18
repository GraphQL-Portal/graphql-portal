import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { GraphQLError, parse, TypeInfo, ValidationContext, visit, Visitor, visitWithTypeInfo } from 'graphql';
import CostAnalysis from 'graphql-cost-analysis/dist/costAnalysis';
import depthLimit from 'graphql-depth-limit';
import { apiSchema } from '../../server/router';
import RequestCostTool from './request-cost.tool';

const logger = prefixLogger('cost-analysis');

export class CustomCostAnalysis extends CostAnalysis {
  public cost = 0;

  public constructor(context: ValidationContext, options: any) {
    super(context, options);
  }
}

const rateLimitMiddleware = (apiDef: ApiDef): RequestHandler => {
  const maxDepth = apiDef.depth_limit || 10;
  const maxCost = apiDef.request_complexity_limit || 1000;
  const costRate = apiDef.rate_limit?.complexity || Infinity;
  const costRatePer = apiDef.rate_limit?.per || 3600;

  logger.debug(`max depth: ${maxDepth}`);
  logger.debug(`max cost: ${maxCost}`);
  logger.debug(`rate: ${costRate} per ${costRatePer} second(s)`);

  const sendError = (res: Response, error: Error, status = 400): void => {
    res.status(status);
    res.json(error);
  };

  const requestCostTool = new RequestCostTool(costRatePer);

  return async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { body } = req;
    if (req.method !== 'POST' || !body?.query || body?.operationName === 'IntrospectionQuery') {
      return next();
    }

    const schema = apiSchema[apiDef.name];
    const query = parse(body.query);
    const typeInfo = new TypeInfo(schema);
    const validationContext = new ValidationContext(schema, query, typeInfo, () => {});

    let depth = 0;
    const setDepth = (depths: { [key: string]: number }): void => {
      depth = Math.max(...Object.values(depths));
    };
    depthLimit(maxDepth, {}, setDepth)(validationContext);
    if (Number.isNaN(depth)) {
      return sendError(res, new GraphQLError(`The query exceeds maximum operation depth of ${maxDepth}`));
    }
    logger.debug(`request ${req.id} from ${req.ip}: depth ${depth}`);

    const visitor = new CustomCostAnalysis(validationContext, {
      maximumCost: maxCost,
      defaultCost: 1,
    });
    visit(query, visitWithTypeInfo(typeInfo, visitor as Visitor<any>));
    const { cost } = visitor;
    if (cost > maxCost) {
      return sendError(res, new GraphQLError(`The query exceeds maximum complexity of ${maxCost}`));
    }
    logger.debug(`request ${req.id} from ${req.ip}: cost ${cost}`);

    if (!Number.isFinite(costRate)) {
      return next();
    }
    const totalCost = (await requestCostTool.getTotalCost(req)) + cost;
    if (totalCost > costRate) {
      return sendError(
        res,
        new GraphQLError(`Too many requests. Exceeded complexity limit of ${costRate} per ${costRatePer} seconds`),
        429
      );
    }
    logger.debug(`request ${req.id} from ${req.ip}: totalCost ${totalCost}`);
    await requestCostTool.saveCost(req, cost);
    return next();
  };
};

export default rateLimitMiddleware;
