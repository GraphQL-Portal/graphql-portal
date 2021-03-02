import { deepSearch } from './utils';

const envVarRegExp = /^@@/;

const isArrayProperty = (key: string, schema: { [key: string]: any }): boolean => {
  return deepSearch(schema, key, (k, v) => v?.type === 'array' && v?.items?.type === 'string');
};

export default function useEnv(config: { [key: string]: any }, schema?: { [key: string]: any }): void {
  Object.keys(config).forEach((key) => {
    const value = config[key];
    if (typeof value === 'string' && envVarRegExp.test(value)) {
      const envValue = process.env[value.replace(envVarRegExp, '')] || '';
      if (schema && isArrayProperty(key, schema)) {
        config[key] = envValue.split(',');
      } else {
        config[key] = envValue;
      }
    }
    if (typeof value === 'object') {
      useEnv(value);
    }
  });
}
