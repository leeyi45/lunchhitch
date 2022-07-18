import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Type returned by API routes
 */
export type APIResult<Result> = {
  result: 'success';
  value: Result;
} | {
  result: 'error';
  value: any;
}

export type Handler<TResult, TReq> = (args: {
  data: TReq,
  req: NextApiRequest,
  res: NextApiResponse,
  params: { [name: string]: string }
}) => Promise<APIResult<TResult>>;

/**
 * Configuration parameters for API route handlers.
 */
export type APIParams<TResult, TReq = any> = {
  params?: string[];
  handlers: {
    [method: string]: Handler<TResult, TReq> | undefined;
  };
  errorHandler?: (error: any, res: NextApiResponse) => void;
}
