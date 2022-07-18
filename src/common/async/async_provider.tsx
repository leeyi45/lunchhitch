/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';

import ErrorScreen from '../auth_selector/error_screen';
import LoadingScreen from '../auth_selector/loading_screen';

export type AsyncStateCompleted<TResult> = {
  status: 'done',
  result: TResult;
}

export type AsyncState<TResult> = ({
  status: 'initial' | 'loading';
  result: undefined;
} | AsyncStateCompleted<TResult>
  | {
  status: 'errored';
  result: any;
})

export type AsyncContextType<TResult, TParams = void> = {
  call: (...params: TParams[]) => void;
  cancel: () => void;
} & AsyncState<TResult>;

export const createAsync = <TResult, TParams = void>(func: (...params: TParams[]) => Promise<TResult>) => {
  const AsyncContext = React.createContext<AsyncContextType<TResult, TParams>>({
    status: 'initial',
    result: undefined,
    call: () => {},
    cancel: () => {},
  });

  type AsyncProps = {
    children? : React.ReactElement | React.ReactElement[] | ((ctx: AsyncContextType<TResult, TParams>) => (React.ReactElement[] | React.ReactElement))
  }

  const Async = ({ children }: AsyncProps) => {
    const [state, setState] = React.useState<AsyncState<TResult>>({
      status: 'loading',
      result: undefined,
    });

    const abortControllerRef = React.useRef(new AbortController());
    const fnWrapperRef = React.useRef((...args: TParams[]) => new Promise<TResult>((resolve, reject) => {
      func(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => abortControllerRef.current.signal.removeEventListener('abort', reject));

      abortControllerRef.current.signal.addEventListener('abort', reject);
    }));

    const promiseFunc = React.useCallback(async (...args: TParams[]) => {
      setState({
        status: 'loading',
        result: undefined,
      });
      try {
        const result = await fnWrapperRef.current(...args);
        setState({
          status: 'done',
          result,
        });
      } catch (error) {
        setState({
          status: 'errored',
          result: error,
        });
      }
    }, [fnWrapperRef.current]);

    const contextObj = React.useMemo(() => ({
      ...state,
      call: promiseFunc,
      cancel: () => abortControllerRef.current.abort(),
    }), [state, promiseFunc, abortControllerRef.current]);

    return (
      <AsyncContext.Provider value={contextObj}>{typeof children === 'function' ? children(contextObj) : children}</AsyncContext.Provider>
    );
  };

  Async.defaultProps = {
    children: undefined,
  };

  type ChildProps = { children?: React.ReactElement | ((ctx: AsyncContextType<TResult, TParams>) => React.ReactElement) }

  return Object.assign(Async, {
    Initial: ({ children }: Required<ChildProps>) => {
      const ctx = React.useContext(AsyncContext);

      if (ctx.status === 'initial') return typeof children === 'function' ? children(ctx) : children;
      else return null;
    },
    Loading: ({ children }: ChildProps) => {
      const ctx = React.useContext(AsyncContext);

      if (ctx.status === 'loading') {
        if (children) return typeof children === 'function' ? children(ctx) : children;
        return <LoadingScreen />;
      } else return null;
    },
    Errored: ({ children }: ChildProps) => {
      const ctx = React.useContext(AsyncContext);

      if (ctx.status === 'errored') {
        if (children) return typeof children === 'function' ? children(ctx) : children;
        return <ErrorScreen error={ctx.result.toString()} />;
      } else return null;
    },
    Done: ({ children }: { children: React.ReactElement | ((ctx: AsyncStateCompleted<TResult>) => React.ReactElement)}) => {
      const ctx = React.useContext(AsyncContext);

      if (ctx.status === 'done') {
        return typeof children === 'function' ? children(ctx) : children;
      } else return null;
    },
  });
};
