import { useRef, useState } from 'react';

/**
 * Represents the state of an async operation
 */
export type AsyncState<TResult, TParams> = ({
  state: 'loading' | 'waiting';
  result: undefined;
} | {
  state: 'errored';
  result: any;
} | {
  state: 'done';
  result: TResult;
}) & {
  /**
   * Execute the promiseFn again with the given arguments
   */
  call: (...args: TParams[]) => void;

  /**
   * Cancel any ongoing promises
   */
  cancel: () => void;
}

/**
 * Hook to manage the retrieval of data using Promises. Refer to the AsyncState object for more details
 * @param promiseFunc Function that returns a promise resolving to the desired data
 * @returns AsyncState object
 */
export default function useAsync<TResult, TParams>(
  promiseFunc: (...params: TParams[]) => Promise<TResult>,
): AsyncState<TResult, TParams> {
  const [state, setState] = useState<'loading' | 'errored' | 'done' | 'waiting'>('waiting');
  const [result, setResult] = useState<TResult | any>(undefined);

  const abortControllerRef = useRef(new AbortController());
  const fnWrapperRef = useRef((...args: TParams[]) => new Promise<TResult>((resolve, reject) => {
    promiseFunc(...args)
      .then(resolve)
      .catch(reject)
      .finally(() => abortControllerRef.current.signal.removeEventListener('abort', reject));

    abortControllerRef.current.signal.addEventListener('abort', reject);
  }));

  return {
    state,
    result,
    call: (...args: any) => {
      setState('loading');
      (async () => {
        try {
          setResult(await fnWrapperRef.current(...args));
          setState('done');
        } catch (error) {
          setResult(error);
          setState('errored');
        }
      })();
    },
    // Using arrow function because of javascript's
    // weirdness around `this`
    cancel: () => abortControllerRef.current.abort(),
  };
}
