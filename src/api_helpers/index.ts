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

/**
 * Wrapper around the `fetch` function to send requests to API routes. If data is provided,
 * the HTTP method is set to `POST`, otherwise it will be `GET`.
 * @param url URL to be appended to `api/` to send the request to
 * @param data Data object to send to the API route
 * @returns Reponse from the API route
 */
export const fetchApi = async <T>(url: string, data?: any): Promise<APIResult<T>> => {
  const resp = await fetch(`${window.location.origin}/api/${url}`, {
    headers: {
      Accept: 'application/json',
      ContentType: 'application/json',
    },
    method: data !== undefined ? 'POST' : 'GET',
    body: data || JSON.stringify(data),
  });
  const result = await resp.text();
  console.log(result);
  return JSON.parse(result);
};

export type { APIResult, APIParams };
