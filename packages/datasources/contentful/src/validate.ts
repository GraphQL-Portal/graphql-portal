import { Config } from './handler';

export function validate(name: string, handler: Config): string | void {
  if (!handler.endpoint && !handler.space) {
    return `Handler "${name}" should have "endpoint" or "space" property`;
  }
}
