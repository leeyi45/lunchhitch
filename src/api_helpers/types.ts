import { NextApiRequest, NextApiResponse } from 'next';

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

/**
 * Configuration parameters for API route handlers.
 */
export type APIParams<TResult, TReq = any> = {
  params?: string[];
  handler: (args: {data: TReq, req: NextApiRequest, res: NextApiResponse, params: { [name: string]: string }}) => Promise<APIResult<TResult>>;
  errorHandler?: (error: any, res: NextApiResponse) => void;
}
