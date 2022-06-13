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

export function useAsyncValue<T>(factory: () => Promise<T>, loadingValue?: T) {
  const [value, setValue] = useState<T | undefined>(loadingValue);

  useEffect(() => {
    factory().then(setValue);
  }, []);

  return value;
}
