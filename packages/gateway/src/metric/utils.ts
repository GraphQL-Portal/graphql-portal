import { ResolverData } from '@graphql-mesh/types';
import { Path } from 'graphql/jsutils/Path';
import { MetricsChannels } from '@graphql-portal/types';

export const reducePath = (path: Path | undefined, result = ''): string | null => {
  if (!path) return null;
  result += `${path.key}.`;
  if (path.prev) return reducePath(path.prev, result);
  return result.slice(0, -1);
};

export const serializer = (data: any, doNotLogkeys: string[] = ['_']): string => {
  return JSON.stringify(data, (key: string, value: any) => {
    if (doNotLogkeys.some((str) => key.startsWith(str))) return;
    return value;
  });
};

export const transformResolverData = (event: MetricsChannels, { info, args }: ResolverData) => {
  return {
    event,
    info,
    args,
    path: reducePath(info?.path),
    source: (info?.returnType as any)?.extensions?.federation?.serviceName,
    date: Date.now(),
  };
};