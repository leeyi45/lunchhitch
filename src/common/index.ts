import { useState } from 'react';

export type KeysOfType<T, K = any> = { [P in keyof T]: T[P] extends K ? P : never }[keyof T];
export type APIResult<Result> = {
  result: 'success';
  value: Result;
} | {
  result: 'error';
  value: any;
}

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
 * Some functions may return a regular value or a Promise. Use this function to wrap the result of such a function as a Promise
 * @param result Result to wrap
 * @returns Promise that resolves to the result
 */
export function wrapIntoPromise<T>(result: (T | Promise<T>)) {
  return result instanceof Promise ? result : Promise.resolve(result);
}

export function entries<T extends { [key: string]: any }>(obj: T) {
  return Object.entries(obj) as [KeysOfType<T, string>, T[string]][];
}

export const useNullableState = <T>(defaultVal?: (T | null)) => useState<T | null>(defaultVal ?? null);
