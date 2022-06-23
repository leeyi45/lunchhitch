import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { LunchHitchUser } from './auth/auth';
import { wrapIntoPromise } from './common';

type Params = {
  [name: string]: string;
};

type Handler<P extends Params> = (req: NextApiRequest, res: NextApiResponse, params: P) => any | Promise<any>;

type ErrorHandler = (error: any, res: NextApiResponse) => void;

/**
 * Wrap API routes to automatically return HTTP 400 if the desired query parameters are not given
 * @param handler API route handler
 * @param params Array containing the keys of the desired parameters
 * @returns Wrapped API route handler
 */
export const wrapWithQuery = <P extends Params>(
  params: string[],
  handler: Handler<P>,
  errorHandler?: ErrorHandler,
) => async (req: NextApiRequest, res: NextApiResponse) => {
    const query = req.query as P;
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
    }, { hasError: false, result: [] as string[], paramResult: {} as P });

    if (errored) {
      res.status(400).json({ error: `Missing required query params: ${errors.join(', ')}` });
    } else {
      try {
        res.status(200).json(await wrapIntoPromise(handler(req, res, queryParams)));
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

/**
 * Wrap API routes to automatically require a username parameter and check authentication using `getSession` and return HTTP 401/403
 * @param handler API route handler
 * @param paramStrs Array containing the keys of the desired parameters
 * @returns Wrapped API route handler
 */
export const wrapWithAuth = <P extends Params>(
  paramStrs: string[],
  handler: Handler<P & { username: string }>,
  errorHandler?: ErrorHandler,
) => wrapWithQuery<P & { username: string }>([...paramStrs, 'username'], async (request, response, params) => {
  const session = await getSession();

  if (!session) {
    response.status(401).json({ error: 'Must be logged in' });
    return undefined;
  }

  const user = session.user as LunchHitchUser;
  if (user.username !== params.username) {
    response.status(403).json({ error: `Must be logged in as ${params.username}` });
    return undefined;
  }

  return wrapIntoPromise(handler(request, response, params));
}, errorHandler);
