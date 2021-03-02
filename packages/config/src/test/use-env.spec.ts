import useEnv from '../use-env';

describe('useEnv', () => {
  const envVariableName = 'TEST_USE_ENV';
  const key = 'key';
  let config: { [key]: string };

  beforeEach(() => {
    config = {
      [key]: `@@${envVariableName}`,
    };
  });

  it('should replace variables that starts with @@', () => {
    const value = 'value';

    process.env[envVariableName] = value;

    useEnv(config);
    expect(config[key]).toBe(value);
  });

  it('should replace variable with array', () => {
    const values = ['1', '2', '3'];

    process.env[envVariableName] = values.join(',');

    useEnv(config, { [key]: { type: 'array', items: { type: 'string' } } } as any);
    expect(config[key]).toStrictEqual(values);
  });
});
