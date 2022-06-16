import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { LunchHitchUser } from './auth';
import { KeysOfType, wrapIntoPromise } from './common';

type Params = {
  [name: string]: string;
};

type Handler<P extends Params> = (req: NextApiRequest, res: NextApiResponse, params: P) => any | Promise<any>;

type ErrorHandler = (error: any, res: NextApiResponse) => void;

type KeysArray<T> = KeysOfType<T, any>[];

export function wrapQuery<P extends string>(
  params: (keyof P)[],
  handler: (req: NextApiRequest, res: NextApiResponse, p: { [K in keyof P]: string }) => any | Promise<any>,
  errorHandler?: ErrorHandler,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    type ParamResult = { [K in keyof P]: string };

    const query = req.query as ParamResult;
    const result = params.reduce(({ hasError, errors, paramResult }, param) => {
      if (typeof query[param] !== 'string') {
        errors.push(param);
        return {
          hasError: true,
          errors,
          paramResult,
        };
      } else {
        return {
          hasError,
          errors,
          paramResult: {
            ...paramResult,
            [param]: query[param],
          },
        };
      }
    }, { hasError: false, errors: [] as (keyof P)[], paramResult: {} as ParamResult });

    if (result.hasError) {
      res.status(400).json({ error: `Missing required query params: ${result.errors.join(', ')}` });
    } else {
      try {
        res.status(200).json(await wrapIntoPromise(handler(req, res, result.paramResult)));
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
}

export function wrapAuth<P extends string>(
  params: (keyof P)[],
  handler: (req: NextApiRequest, res: NextApiResponse, p: { [K in keyof P]: string }) => any | Promise<any>,
  errorHandler?: ErrorHandler,
) {
  return wrapQuery<P | 'username'>([...params, 'username'], async (res, req, params) => {

  }, errorHandler);
}

/**
 * Wrap API routes to automatically return HTTP 400 if the desired query parameters are not given
 * @param handler API route handler
 * @param params Array containing the keys of the desired parameters
 * @returns Wrapped API route handler
 */
export function wrapWithQuery<P extends Params>(params: KeysArray<P>, handler: Handler<P>, errorHandler?: ErrorHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
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
    }, { hasError: false, result: [] as KeysArray<P>, paramResult: {} as P });

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
}

type Test1 = {
  hi: boolean;
  bye: boolean;
}

const keys1: KeysArray<Test1> = ['hi'];
const keys2: KeysArray<Test1 & { yippee: string }> = [...keys1, 'yippee'];

/**
 * Wrap API routes to automatically require a username parameter and check authentication using `getSession` and return HTTP 401/403
 * @param handler API route handler
 * @param params Array containing the keys of the desired parameters
 * @returns Wrapped API route handler
 */
export function wrapWithAuth<P extends Params>(
  params: KeysArray<P>,
  handler: Handler<P & { username: string }>,
  errorHandler?: ErrorHandler,
) {
  // eslint-disable-next-line no-shadow
  return wrapWithQuery<P & { username: string }>([...params, 'username'], async (request, response, params) => {
    const session = await getSession();

    if (!session) {
      response.status(401).json({ error: 'Must be logged in' });
      return undefined;
    }

    const user = session.user as LunchHitchUser;
    if (user.username !== request.query.username) {
      response.status(403).json({ error: `Must be logged in as ${request.query.username}` });
      return undefined;
    }

    return wrapIntoPromise(handler(request, response, params));
  }, errorHandler);
}
