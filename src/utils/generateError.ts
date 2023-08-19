import { HTTPError } from '../types';

export const generateError = (context: string, error: unknown) => {
  const message =
    error instanceof Error ? error.message : 'Internal server error';

  return new HTTPError(500, message, context);
};
