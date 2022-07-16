import { useState } from 'react';
import { UserInfo } from '@prisma/client';

export type KeysOfType<T, K = any> = { [P in keyof T]: T[P] extends K ? P : never }[keyof T];
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

export type SessionUser = {
  displayName: string;
  username: string;
}

export type SessionUserWithProfile = SessionUser & UserInfo;
