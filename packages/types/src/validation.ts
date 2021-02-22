import Ajv from 'ajv';
import { sourceSchema, apiDefSchema } from '.';

export function validateSourceConfig(source: any): string | void {
  const ajv = new Ajv({ strict: false });
  const validate = ajv.compile(sourceSchema);
  if (!validate(source)) {
    return ajv.errorsText(validate.errors, {
      dataVar: 'source',
    });
  }
}

export function validateApiDefConfig(apiDef: any): string | void {
  const ajv = new Ajv({ strict: false });
  const validate = ajv.compile(apiDefSchema);
  if (!validate(apiDef)) {
    return ajv.errorsText(validate.errors, {
      dataVar: 'apiDef',
    });
  }
}
