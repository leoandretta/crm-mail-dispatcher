import { Request, Response } from "express";
import { UnknownRouteError } from "@/utils/exceptions";

export const unknownRoute = (req: Request, res: Response) => {
  console.warn(`Rota não encontrada: ${req.originalUrl}`);

  const parsedError = new UnknownRouteError();

  res.status(parsedError.status).json({
    success: false,
    route: req.originalUrl,
    message: parsedError.message,
    code: parsedError.code,
    type: parsedError.type
  });
}