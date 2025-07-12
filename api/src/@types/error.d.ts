declare global {
  interface Error {
      name?: string;
      code?: string;
      message?: string;
      type?: string;
      status?: number;
      stack?: string;
      errors?: any;
  }

  export type ErrorMap = {
    [key: string]: {
      message: string;
      params: boolean;
      regex?: RegExp;
    };
  }
}

export { }