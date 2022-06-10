/* eslint-disable no-redeclare */
import { useRef } from 'react';

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
