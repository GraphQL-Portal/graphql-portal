import { ResolverData } from '@graphql-mesh/types';
import { Path } from 'graphql/jsutils/Path';
import { MetricsChannels } from '@graphql-portal/types';

export const reducePath = (path: Path | undefined, result = ''): string | null => {
  if (!path) return null;
  result = `${path.key}.${result}`;
  if (path.prev) return reducePath(path.prev, result);
  return result.replace(/\.$/, '');
};

export const serializer = (data: any, doNotLogkeys: string[] = ['_']): string => {
  return JSON.stringify(data, (key: string, value: any) => {
    if (doNotLogkeys.some((str) => key.startsWith(str))) return;
    return value;
  });
};

export const getSourceName = ({ info }: ResolverData): string | undefined => {
  return (info?.returnType as any)?.extensions?.federation?.serviceName;
};

export const transformResolverData = (event: MetricsChannels, data: ResolverData) => {
  return {
    event,
    path: reducePath(data.info?.path),
    source: getSourceName(data),
    date: Date.now(),
  };
};
