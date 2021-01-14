import { Request } from 'express';

export type RequestWithId = Request & { id: string };