export class HTTPError extends Error {
  code: number;
  context?: string;

  constructor(code: number, message: string, context?: string) {
    super(message);

    this.code = code;
    this.context = context;
  }
}
