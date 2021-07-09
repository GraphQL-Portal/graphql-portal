import { apiDefSchema } from '@graphql-portal/types';
import { deepSearch } from './utils';

const envVarRegExp = /^@@/;

const isStringArrayProperty = (key: string, schema: typeof apiDefSchema): boolean => {
  return deepSearch(schema, key, (k, v) => v?.type === 'array' && v?.items?.type === 'string');
};

const isBooleanProperty = (value: string): boolean => {
  return value === 'false' || value === 'true';
};

const toBoolean = (value: string): boolean => {
  return value === 'true';
};

export default function useEnv(config: { [key: string]: any }, schema?: typeof apiDefSchema): void {
  Object.keys(config).forEach((key: string) => {
    const value = config[key];
    if (typeof value === 'string' && envVarRegExp.test(value)) {
      const envValue = process.env[value.replace(envVarRegExp, '')] || '';
      if (schema && isStringArrayProperty(key, schema)) {
        config[key] = envValue.split(',');
      } else if (isBooleanProperty(envValue)) {
        config[key] = toBoolean(envValue);
      } else {
        config[key] = envValue;
      }
    }
    if (value && typeof value === 'object') {
      useEnv(value);
    }
  });
}
