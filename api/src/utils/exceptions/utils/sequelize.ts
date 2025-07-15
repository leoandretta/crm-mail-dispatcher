export const sequelizeErrors: Record<string, string>  = {
  'SequelizeAccessDeniedError': 'Acesso negado ao banco de dados.',
  'SequelizeConnectionAcquireTimeoutError': 'Tempo esgotado ao tentar estabelecer uma conexão com o banco de dados.',
  'SequelizeConnectionRefusedError': 'A conexão com o banco de dados foi recusada.',
  'SequelizeConnectionTimedOutError': 'A conexão com o banco de dados expirou.',
  'SequelizeHostNotFoundError': 'Servidor de banco de dados não encontrado.',
  'SequelizeHostNotReachableError': 'Servidor de banco de dados não está acessível.',
  'SequelizeInvalidConnectionError': 'Conexão inválida com o banco de dados.',
  'SequelizeExclusionConstraintError': 'Não foi possível realizar a ação devido a uma regra de exclusão.',
  'SequelizeForeignKeyConstraintError': 'Verifique se os registros relacionados existem no banco de dados.',
  'SequelizeTimeoutError': 'Operação no banco de dados excedeu o tempo limite. Tente novamente mais tarde.',
  'SequelizeUnknownConstraintError': 'Erro desconhecido. Entre em contato com o suporte.',
  'AggregateError': 'Ocorreu mais de um erro. Por favor, tente novamente.',
  'SequelizeAssociationError': 'Erro ao associar os dados.',
  'SequelizeBaseError': 'Erro de banco de dados.',
  'SequelizeBulkRecordError': 'Erro ao processar múltiplos registros no banco de dados.',
  'SequelizeConnectionError': 'Erro de conexão com o banco de dados.',
  'SequelizeDatabaseError': 'Erro de banco de dados. Verifique a integridade dos dados e tente novamente.',
  'SequelizeEagerLoadingError': 'Erro ao carregar dados relacionados.',
  'SequelizeEmptyResultError': 'Nenhum resultado encontrado.',
  'SequelizeInstanceError': 'Erro ao manipular o registro do banco de dados. Tente novamente ou revise os dados.',
  'SequelizeOptimisticLockError': 'Os dados foram alterados por outro usuário antes de você salvar suas mudanças. Tente novamente ou revise os dados.',
  'SequelizeQueryError': 'Erro ao executar a consulta no banco de dados. Verifique a sintaxe ou os dados fornecidos.',
  'SequelizeScopeError': 'Verifique o contexto da consulta ou operação.',
  'SequelizeValidationError': 'Erro de validação. Revise os dados e tente novamente.',
  'SequelizeUniqueConstraintError': 'Um registro semelhante já existe no banco de dados.'
};

const SEQUELIZE_ERRORS: ErrorMap = {
  "notNull Violation": {
    message: "O campo %s é obrigatório",
    params: true,
    regex: /"(.*?)"/
  },
  "cannot be null": {
    message: "O campo %s é obrigatório",
    params: true,
    regex: /"(.*?)"/
  },
  "does not exist": {
    message: "A coluna não existe: '%s'",
    params: true,
    regex: /column (.*?) does not exist/
  },
  "null value in column": {
    message: "O campo %s é obrigatório",
    params: true,
    regex: /column (.*?)/
  },
  "Validation error": {
    message: "Já existe uma entidade com esses dados",
    params: false
  },
  "foreign key constraint": {
    message: "Registro não encontrado",
    params: false
  },
  "is not present in table": {
    message: "Registro não encontrado",
    params: false
  },
  "unique violation": {
    message: "Registro duplicado",
    params: false
  },
  "duplicate key value violates unique constraint": {
    message: "Registro duplicado",
    params: false
  },
  "out of range": {
    message: "Valor fora do intervalo permitido",
    params: false
  },
  "You attempted to save an instance with no primary key, this is not allowed since it would result in a global update": {
    message: "Erro interno do servidor",
    params: false
  },
  "invalid input syntax": {
    message: "Valor inválido: '%s'",
    params: true,
    regex: /"(.*?)"/
  },
  "invalid input value": {
    message: "Valor inválido: '%s'",
    params: true,
    regex: /"(.*?)"/
  },
  "operator does not exist": {
    message: "Operador inválido para a consulta",
    params: false
  },
  "Invalid scope": {
    message: "Escopo inválido: '%s'",
    params: true,
    regex: /scope (.*?) called/
  },
  "Association with alias": {
    message: "Associação com alias inválido: '%s'",
    params: true,
    regex: /alias "(.*?)" does not exist/
  },
  "cannot read properties": {
    message: "Informação inválida: '%s'",
    params: true,
    regex: /(reading '(.*?)')/
  },
  "column reference": {
    message: "Coluna inválida: '%s'",
    params: true,
    regex: /column reference "(.*?)"/
  },
  "value too long": {
    message: "Valor muito longo",
    params: false
  },
  "value too short": {
    message: "Valor muito curto",
    params: false
  },
  "duplicar valor da chave viola a restrição de unicidade": {
    message: "Registro duplicado",
    params: false
  },
  "WHERE parameter": {
    message: "Parâmetro inválido: '%s'",
    params: false,
    regex: /WHERE parameter "(.*?)"/
  },
  "Argument passed to findByPk is invalid:": {
    message: "ID inválido",
    params: false
  },
  "Include unexpected": {
    message: "Inclusão inesperada",
    params: false
  },
  "referência à coluna": {
    message: "Coluna inválida: '%s'",
    params: true,
    regex: /referência à coluna "(.*?)"/
  }
}

export const customformatSequelizeError = (error: Error): string | null => {
  try {
    const message = error.message;
   
    for (const key in SEQUELIZE_ERRORS) {
      if (message.includes(key) || message.match(SEQUELIZE_ERRORS[key].message)) {
        const { message: errorMessage, params } = SEQUELIZE_ERRORS[key];
        if (params) {
          const field = message.match(SEQUELIZE_ERRORS[key].regex ?? /"(.*?)"/)?.[1];
          return errorMessage.replace("%s", field ?? "");
        }
        return errorMessage;
      }
    }

    return message;
  }
  catch (error) {
    console.error(error.message);
    return null;
  }
}