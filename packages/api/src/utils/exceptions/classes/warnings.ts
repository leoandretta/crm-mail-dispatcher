export class Warn extends Error {
  public readonly code: string;
  public readonly type: string = "warn";
  public readonly status: number = 400;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.code = code ?? "SWARN";
    this.status = status ?? this.status;
  }
}

export class ValidationWarn extends Warn {
  constructor(message?: string) {
    super("SVALIDWARN", message ?? "Erro de validação", 400);
  }
}

export class AlreadyExists extends Warn {
  constructor(field?: string) {
    super("SAEXISTWARN", `Já existe um registro com este ${field ?? "id"}`, 409);
  }
}

export class BadRequest extends Warn {
  constructor(message?: string) {
    super("SBREQWARN", message ?? "Requisição inválida", 403);
  }
}

export class Unauthorized extends Warn {
  constructor(message?: string) {
    super("SUNAUTHWARN", message ?? "Não autorizado", 401);
  }
}

export class NotFound extends Warn {
  constructor(message?: string) {
    super("SNFOUNDWARN", message ?? "Registro não encontrado", 404);
  }
}

export class NotImplemented extends Warn {
  constructor(message?: string) {
    super("SNIMPWARN", message ?? "Método não implementado", 501);
  }
}

export class Forbidden extends Warn {
  constructor(message?: string) {
    super("SFORBWARN", message ?? "Acesso negado", 403);
  }
}