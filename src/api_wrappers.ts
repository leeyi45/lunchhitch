import { NextApiRequest, NextApiResponse } from 'next';

import testUser from './auth/test_user';
import { getSession } from './firebase/admin';
import { APIResult, wrapIntoPromise } from './common';

type Params = {
  [name: string]: string;
};

export type APIParams<T> = {
  params?: string[];
  handler: (args: {req: NextApiRequest, res: NextApiResponse, params: Params}) => Promise<APIResult<T>>;
  errorHandler?: (error: any, res: NextApiResponse) => void;
}

/**
 * Wrap API routes to automatically return HTTP 400 if the desired query parameters are not given
 * @param handler API route handler
 * @param params Array containing the keys of the desired parameters
 * @returns Wrapped API route handler
 */
export const wrapWithQuery = <T>({
  params,
  handler,
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
        const result = await wrapIntoPromise(handler({ req, res, params: queryParams }));
        if (result !== undefined) res.status(200).json(result);
      } catch (error) {
        if (errorHandler) errorHandler(error, res);
        else if (process.env.NODE_ENV === 'production') {
          res.status(500).json({ result: 'error', value: error } as APIResult<T>);
          return;
        }
        throw error;
      }
    }
  };

export const wrapWithAuth = <T>({ handler: apiHandler, ...apiParams }: APIParams<T>) => wrapWithQuery<T>({
  ...apiParams,
  async handler({ req, res, params }) {
    if (req.query.force === '') {
      return wrapIntoPromise(apiHandler({ req, res, params: { username: testUser.username, ...params } }));
    }

    const username = await getSession(req.cookies.token);
    if (!username) {
      res.status(401).json({ error: 'Must be logged in' });
      return undefined as never;
    }
    return wrapIntoPromise(apiHandler({ req, res, params: { username, ...params } }));
  },
});
