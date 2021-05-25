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

export const getSourceName = ({ context }: ResolverData): string | null => {
  for (const [key, value] of Object.entries(context)) {
    if ((value as any)?.rawSource?.name) return key;
  }
  return null;
};

export const transformResolverData = (
  event: MetricsChannels,
  data: ResolverData
): {
  event: MetricsChannels;
  path: string | null;
  source: string | null;
  date: number;
} => {
  return {
    event,
    path: reducePath(data.info?.path),
    source: getSourceName(data),
    date: Date.now(),
  };
};
