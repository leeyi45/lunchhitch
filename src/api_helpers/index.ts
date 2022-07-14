import type { APIParams, APIResult } from './types';

export function asApiSuccess<T>(value: T): APIResult<T> { return { result: 'success', value }; }
export function asApiError<T>(value: any): APIResult<T> { return { result: 'error', value }; }

export async function wrapApiResult<T>(func: () => Promise<T>): Promise<APIResult<T>> {
  try {
    return asApiSuccess(await func());
  } catch (error: any) {
    return asApiError(error.toString());
  }
}

export const fetchApi = async <T>(url: string, data?: any): Promise<APIResult<T>> => {
  const resp = await fetch(`api/${url}`, {
    method: data === undefined ? 'POST' : 'GET',
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  return resp.json();
};

export type { APIResult, APIParams };
