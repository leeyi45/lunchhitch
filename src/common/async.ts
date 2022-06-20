import { useState } from 'react';

type ReturnType<TReturn> = ({
  state: 'loading';
  result: undefined;
} | {
  state: 'errored';
  result: any;
} | {
  state: 'done';
  result: TReturn;
}) & {
  /**
   * Execute the promiseFn again with the given arguments
   */
  call: (...args: any[]) => void;
}

export default function useAsync<TReturn>(promiseFunc: (...args: any[]) => Promise<TReturn>): ReturnType<TReturn> {
  const [state, setState] = useState<'loading' | 'errored' | 'done'>('loading');
  const [result, setResult] = useState<TReturn | any>(undefined);

  return {
    state,
    result,
    call: (...args: any[]) => {
      setState('loading');
      (async () => {
        try {
          setResult(await promiseFunc(...args));
          setState('done');
        } catch (error) {
          setResult(error);
          setState('errored');
        }
      })();
    },
  };
}
