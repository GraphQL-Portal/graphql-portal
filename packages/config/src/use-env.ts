import { apiDefSchema } from '@graphql-portal/types';
import { deepSearch } from './utils';

const envVarRegExp = /^@@/;

const isStringArrayProperty = (key: string, schema: typeof apiDefSchema): boolean => {
  return deepSearch(schema, key, (k, v) => v?.type === 'array' && v?.items?.type === 'string');
};

export default function useEnv(config: { [key: string]: any }, schema?: typeof apiDefSchema): void {
  Object.keys(config).forEach((key: string) => {
    const value = config[key];
    if (typeof value === 'string' && envVarRegExp.test(value)) {
      const envValue = process.env[value.replace(envVarRegExp, '')] || '';
      if (schema && isStringArrayProperty(key, schema)) {
        config[key] = envValue.split(',');
      } else {
        config[key] = envValue;
      }
    }
    if (value && typeof value === 'object') {
      useEnv(value);
    }
  });
}
