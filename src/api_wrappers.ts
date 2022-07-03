import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from './firebase/admin';
import { wrapIntoPromise } from './common';

type Params = {
  [name: string]: string;
};

type Handler = (req: NextApiRequest, res: NextApiResponse, params: Params) => any | Promise<any>;

type ErrorHandler = (error: any, res: NextApiResponse) => void;

/**
 * Wrap API routes to automatically return HTTP 400 if the desired query parameters are not given
 * @param handler API route handler
 * @param params Array containing the keys of the desired parameters
 * @returns Wrapped API route handler
 */
export const wrapWithQuery = (
  params: string[],
  handler: Handler,
  errorHandler?: ErrorHandler,
) => async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as Params;
  const { hasError: errored, result: errors, paramResult: queryParams } = params.reduce(({ hasError, result, paramResult }, param) => {
    if (typeof query[param] !== 'string') {
      result.push(param);
      return {
        hasError: true,
        result,
        paramResult,
      };
    }
    return {
      hasError,
      result,
      paramResult: {
        ...paramResult,
        [param]: query[param],
      },
    };
  }, { hasError: false, result: [] as string[], paramResult: {} as Params });

  if (errored) {
    res.status(400).json({ error: `Missing required query params: ${errors.join(', ')}` });
  } else {
    try {
      const result = await wrapIntoPromise(handler(req, res, queryParams));
      res.status(200).json(result);
    } catch (error) {
      if (errorHandler) errorHandler(error, res);
      else if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ error });
        return;
      }
      throw error;
    }
  }
};

export const wrapWithAuth = (
  paramStrs: string[],
  handler: Handler,
  errorHandler?: ErrorHandler,
) => wrapWithQuery(paramStrs, async (request, response, params) => {
  const username = await getSession(request.cookies.token);
  if (!username) {
    response.status(401).json({ error: 'Must be logged in' });
    return undefined;
  }
  return wrapIntoPromise(handler(request, response, { username, ...params }));
}, errorHandler);
