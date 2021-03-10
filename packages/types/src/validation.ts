import Ajv, { ErrorObject } from 'ajv';
import { sourceSchema, apiDefSchema } from '.';

export function validateSourceConfig(source: any): string | void {
  const ajv = new Ajv({ strict: false });
  const validate = ajv.compile(sourceSchema);
  if (!validate(source)) {
    return getAjvErrorsText(ajv, validate.errors!, 'source');
  }
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
    ?.map((error) => Object.values(error.params))
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
