import { GetMeshSourceOptions, YamlConfig } from '@graphql-mesh/types';
const OpenAPIHandler = require('@graphql-mesh/openapi');

const OPENAPI_SPECIFICATION: string = 'https://www.weatherbit.io/static/swagger.json';
const BASE_URL: string = 'https://api.weatherbit.io';

export default class WeatherbitHandler extends OpenAPIHandler {
  constructor({ name, config, cache }: GetMeshSourceOptions<YamlConfig.OpenapiHandler>) {
    config.source = OPENAPI_SPECIFICATION;
    config.baseUrl = BASE_URL;
    super({ name, config, cache});
  }
}
