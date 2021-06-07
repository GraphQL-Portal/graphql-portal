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

export const getSourceName = ({ context, info }: ResolverData): string | null => {
  const fieldName = info?.fieldName;

  if (!context || !fieldName) return null;

  const sources = Object.values(context).reduce<unknown[]>((acc, { rawSource }) => {
    if (rawSource?.name) acc.push(rawSource);
    return acc;
  }, []);

  for (const source of sources) {
    const queries = (source as any).schema?._queryType?._fields || {};
    const mutations = (source as any).schema?._mutationType?._fields || {};
    const fields = { ...queries, ...mutations };
    const fieldNames = Object.keys(fields);

    if (fieldNames.includes(fieldName)) {
      return (source as any).name;
    }
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
} => {
  return {
    event,
    path: reducePath(data.info?.path),
    source: getSourceName(data),
  };
};
