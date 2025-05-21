import { Request, Response, NextFunction } from 'express';
import { parseError } from '@/utils/exceptions';
import { splitUrl } from '@/utils/format';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const parsedError = parseError(error);

  console.error(`${req.originalUrl} - ${error.message}`);

  res.status(parsedError.status || 500).json({
    success: false,
    route: splitUrl(req.originalUrl).route,
    message: parsedError.message,
    code: parsedError.code,
    type: parsedError.type,
  });
}