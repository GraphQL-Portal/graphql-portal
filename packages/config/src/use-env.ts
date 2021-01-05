const envVarRegExp = /^@@/;

export default function useEnv(config: { [key: string]: any }) {
  Object.keys(config).forEach((key) => {
    const value = config[key];
    if (typeof value === 'string' && envVarRegExp.test(value)) {
      config[key] = process.env[value.replace(envVarRegExp, '')] || '';
    }
    if (typeof value === 'object') {
      useEnv(value);
    }
  });
}
