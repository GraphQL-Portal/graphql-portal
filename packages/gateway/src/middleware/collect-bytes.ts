import { RequestHandler } from 'express';
import { incrementBytesIn, incrementBytesOut } from '../utils/byte.tool';

const collectBytes: RequestHandler = (req, res, next) => {
  req.on('data', (buffer: Buffer) => incrementBytesIn(Number(buffer.byteLength)));
  res.on('finish', () => incrementBytesOut(Number((res.get('content-length')))));
  next();
};

export default () => collectBytes;
