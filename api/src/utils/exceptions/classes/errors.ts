export class Exception extends Error {
  public readonly code: string;
  public readonly type: string = "error";
  public readonly status: number = 500;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.code = code ?? "SERR";
    this.status = status ?? this.status;
  }
}

export class InternalServerError extends Exception {
  constructor(message?: string) {
    super("SSYSERR", message ?? "Erro interno do servidor", 500);
  }
}

export class DatabaseError extends Exception {
  constructor(message?: string) {
    super("SDBERR", message ?? "Erro no banco de dados", 500);
  }
}

export class MailError extends Exception {
  constructor(message?: string) {
    super("SMAILERR", message ?? "Erro ao enviar e-mail", 500);
  }
}

export class UnknownRouteError extends Exception {
  constructor(message?: string) {
    super("SROUTEERR", message ?? "Rota não encontrada", 404);
  }
}

export class FunctionTimeout extends Exception {
  constructor(message?: string) {
    super("SFUNCTIMEOUT", message ?? "Tempo excedido para finalização.", 408);
  }
}