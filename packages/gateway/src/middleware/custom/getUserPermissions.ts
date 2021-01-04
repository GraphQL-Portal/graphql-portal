import { ApiDef } from '@graphql-portal/types';
import axios from 'axios';
import { RequestHandler } from 'express';
import { prepareForwardedHeader, setForwardedHeader } from '../forward-headers';

module.exports = function getUserPermissions(apiDef: ApiDef): RequestHandler {
  const forwardedHeader = 'x-user-permissions';
  prepareForwardedHeader(forwardedHeader, apiDef);

  return async function (req, res, next) {
    if (req?.headers?.authorization) {
      const { data } = await axios.get('http://authorization-service.internal.svc.cluster.local/permissions', {
        headers: {
          authorization: req.headers.authorization,
        },
      });
      setForwardedHeader(req, forwardedHeader, JSON.stringify(data));
    }
    next();
  };
};
