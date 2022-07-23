/**
 * Because this file imports functions from firebase admin, this file cannot be imported
 * by anything that is required client-side
 */
import { NextApiRequest, NextApiResponse } from 'next';

import testUser from '../auth/test_user';
import { wrapIntoPromise } from '../common';
import { getSession } from '../firebase/admin';

import { APIParams, APIResult, Handler } from './types';

type Params = {
  [name: string]: string;
};

/**
 * Wrap API routes handlers to automatically return HTTP 400 if the desired query parameters are not given
 * @returns Wrapped API route handler
 */
export const wrapWithQuery = <T, U>({
  params,
  handlers,
  errorHandler,
}: APIParams<T>) => async (req: NextApiRequest, res: NextApiResponse) => {
    const query = req.query as Params;
    const { hasError: errored, result: errors, paramResult: queryParams } = (params ?? []).reduce(({ hasError, result, paramResult }, param) => {
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
      res.status(400).json({ result: 'error', value: `Missing required query params: ${errors.join(', ')}` } as APIResult<T>);
    } else {
      try {
        const handler = handlers[req.method as string];

        if (!handler) {
          res.status(405).json({ result: 'error', value: `Unsupported HTTP method: '${req.method}'` });
          return;
        }

        const result = await wrapIntoPromise(handler({
          data: req.body as U, req, res, params: queryParams,
        }));

        console.log(`API route ${req.url} received a request`);
        if (result !== undefined) res.status(200).json(result);
      } catch (error) {
        if (errorHandler) errorHandler(error, res);
        else {
          res.status(500).json({ result: 'error', value: error } as APIResult<T>);
          console.log(error);
        }
      }
    }
  };

/**
 * Wrap an API route handler to require authentication. The API route will return a 401 if the user is unauthorized
 */
export const wrapWithAuth = <T, U>({ handlers: apiHandlers, ...apiParams }: APIParams<T>) => async (req: NextApiRequest, res: NextApiResponse) => {
  const username = (req.query.force === '' && process.env.NODE_ENV !== 'production') ? testUser.username : await getSession(req.cookies.token);

  if (!username) {
    res.status(401).json({ result: 'error', value: 'Must be logged in' });
    return undefined as never;
  }

  return wrapWithQuery<T, U>({
    ...apiParams,
    handlers: Object.entries(apiHandlers).reduce((result, [method, handler]) => ({
      ...result,
      [method]: handler ? async ({ params, ...others }: Parameters<Handler<T, U>>[0]) => handler({ ...others, params: { username, ...params } }) : undefined,
    }), {}),
  })(req, res);
};

export const prismaHandler = <TResult, TData>(func: (...args: Parameters<Handler<TResult, TData>>) => Promise<TResult | null>): Handler<TResult, TData> => async (params) => {
  const value = await func(params);
  return value ? { result: 'success', value } : { result: 'error', value: 'No document matched the given criteria!' };
};
