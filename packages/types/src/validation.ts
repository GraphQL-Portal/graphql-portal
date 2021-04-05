import Ajv, { ErrorObject } from 'ajv';
import { sourceSchema, apiDefSchema } from '.';
import { packageHandler, packageValidation } from '@graphql-portal/datasources';
import { SourceConfig } from './mesh-source-config';

export function isCustomHandler(source: SourceConfig): string | void {
  const packageName = Object.keys(source.handler)[0];
  if (packageName in packageHandler) {
    return packageName;
  }
}

export function packageToHandlerName(sourceArg: SourceConfig): SourceConfig {
  const source = JSON.parse(JSON.stringify(sourceArg));
  const packageName = isCustomHandler(source);
  if (packageName) {
    source.handler[packageHandler[packageName]] = source.handler[packageName];
    delete source.handler[packageName];
  }
  return source;
}

export function customValidation(source: SourceConfig): string | void {
  const packageName = isCustomHandler(source);
  if (!packageName) return;
  const validate = packageValidation[packageName];
  if (validate) return validate(source.name, source.handler[packageName]);
}

export function validateSourceConfig(source: any): string | void {
  const ajv = new Ajv({ strict: false });
  const validate = ajv.compile(sourceSchema);
  if (!validate(packageToHandlerName(source))) {
    return getAjvErrorsText(ajv, validate.errors!, 'source');
  }
  return customValidation(source);
}

export function validateApiDefConfig(apiDef: any): string | void {
  const ajv = new Ajv({ strict: false });
  const validate = ajv.compile(apiDefSchema);
  if (!validate(apiDef)) {
    return getAjvErrorsText(ajv, validate.errors!, 'apiDef');
  }
}

export function getAjvErrorsText(ajv: Ajv, errors: ErrorObject[], dataVar: string): string {
  const keys = errors
    ?.map(error => Object.values(error.params))
    .filter(Boolean)
    .join(', ');
  let result = ajv.errorsText(errors, {
    dataVar,
  });
  if (keys?.length && !result.includes("'")) {
    result += `: ${keys}`;
  }
  return result;
}
