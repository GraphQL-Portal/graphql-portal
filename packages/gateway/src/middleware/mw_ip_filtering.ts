import { RequestHandler } from 'express';
import { ApiDef } from '@graphql-portal/types';
import { RequestMiddleware } from './request-middleware.interface';
import { prefixLogger } from '@graphql-portal/logger';
import { getClientIp } from 'request-ip';
import { inRange, isIP } from 'range_check';

type Strategy = 'allow' | 'deny' | 'none';

const getMiddleware: RequestMiddleware = function (apiDef: ApiDef): RequestHandler {
  // skipping if disabled
  if (apiDef.enable_ip_filtering !== true) {
    return (req, res, next) => next();
  }

  let ips: string[] = [];
  let strategy: Strategy = 'none';
  const logger = prefixLogger('mw_ip_blacklist');
  const ipValidator = function (ip: string): boolean {
    if (!isIP(ip)) {
      logger.warn('Incorrect IP: "%s". Skipping...', ip);
      return false;
    }
    return true;
  };

  if (apiDef.allow_ips && apiDef.allow_ips.length > 0) {
    strategy = 'allow';
    ips = apiDef.allow_ips.filter(ipValidator);
    logger.info('Enabling requests from the following IPs: %s', ips);
  }

  if (apiDef.deny_ips && apiDef.deny_ips.length > 0 && strategy != 'allow') {
    strategy = 'deny';
    ips = apiDef.deny_ips.filter(ipValidator);
    logger.info('Denying requests from the following IPs: %s', ips);
  }

  if (ips.length === 0 || strategy === 'none') {
    logger.warn('IP filtering is enabled but no valid IPs were found in the configuration. Skipping...');
    return (req, res, next) => next();
  }

  return function (req, res, next) {
    const ip: string = getClientIp(req) as string;

    try {
      if ((strategy === 'allow' && inRange(ip, ips)) || (strategy === 'deny' && !inRange(ip, ips))) {
        logger.debug('IP "%s" is allowed.', ip);
        next();
      } else {
        logger.debug('IP "%s" has been filtered and the request will be denied.', ip);
        res.status(401).send('Request IP is not allowed.');
      }
    } catch (e) {
      logger.warn('Problem while checking the IP validity: "%s". Passing the request.', e.message);
      logger.debug('IP validity full error object: %s', e);
      next();
    }
  };
};

export default getMiddleware;
