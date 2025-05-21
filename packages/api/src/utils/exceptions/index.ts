import { Exception, Warn } from ".";
import { customformatSequelizeError, sequelizeErrors } from "./utils/sequelize";
import { ValidationWarn } from "./classes/warnings";
import { BaseError } from "sequelize";

export const parseError = (error: Error | null): Error => {
  if (!error) {
    console.error(`[UNKNOWN] Erro interno do servidor`);
    return new Exception('UNKNOWN', 'Erro interno do servidor');
  }

  let code: string = error.code ?? error.name ?? 'UNKNOWN';
  let type: 'error' | 'warn' = 'error';
  let message: string = customformatSequelizeError(error) ?? error.message;

  if (error instanceof ValidationWarn) {
    message = error.message;
    type = 'warn';
  }
  else if (error instanceof Exception) {
    message = error.message;
  }
  else if (error instanceof Warn) {
    message = error.message;
    type = 'warn';
  }
  else if (error instanceof BaseError) {
    message = sequelizeErrors[error.name] ?? error.message;
  }
  else if (!error.code && !error.name) {
    message = error.message;
  }

  message = message.normalize('NFD');
  return type === 'error' ? new Exception(code, message, error.status) : new Warn(code, message, error.status);
}

export const parseErrorMessage = (error: Error): string => {
  return parseError(error).message;
}

export * from "./classes";
export * from "./utils";