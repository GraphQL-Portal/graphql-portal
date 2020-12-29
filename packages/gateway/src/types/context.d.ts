import { Context } from '../server';

declare global {
  namespace Express {
    export interface Request {
      context: Context;
    }
  }
}
