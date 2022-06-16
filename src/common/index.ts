/* eslint-disable no-redeclare */
import { onAuthStateChanged, User } from '@firebase/auth';
import { useState, useRef, useEffect } from 'react';
import { FIREBASE_AUTH } from '../firebase';

type TextRef = {
    current: HTMLInputElement | null;
};

export function useTextRef(): TextRef;
// eslint-disable-next-line no-unused-vars
export function useTextRef(count: number): TextRef[];
export function useTextRef(count?: number): TextRef[] | TextRef {
  if (count) {
    return [...Array(count)].map(() => useRef<HTMLInputElement | null>(null));
  }
  return useRef<HTMLInputElement | null>(null);
}

export function useUserState() {
  const [user, setUser] = useState<User | null>(null);
  onAuthStateChanged(FIREBASE_AUTH, setUser);
  return user;
}

export function useAsyncValue<T, U>(factory: () => Promise<T>, loadingValue: U) {
  const [value, setValue] = useState<T | U>(loadingValue);

  useEffect(() => {
    factory().then(setValue);
  }, []);

  return value;
}

/**
 * Some functions may return a regular value or a Promise. Use this function to wrap the result of such a function as a Promise
 * @param result Result to wrap
 * @returns Promise that resolves to the result
 */
export function wrapIntoPromise<T>(result: (T | Promise<T>)) {
  return result instanceof Promise ? result : Promise.resolve(result);
}

export type KeysOfType<T, K> = { [P in keyof T]: T[P] extends K ? P : never }[keyof T];
