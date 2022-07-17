/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';

import ErrorScreen from '../auth_selector/error_screen';
import LoadingScreen from '../auth_selector/loading_screen';

export type AsyncProps<TFunc extends (...params: any) => Promise<any>> = {
  func: TFunc;
  children: React.ReactNode;
};

type AsyncContextType<TFunc extends (...params: any) => Promise<any>> = ({
  status: 'initial' | 'loading';
  result: undefined;
} | {
  status: 'done';
  result: Awaited<TFunc>;
} | {
  status: 'errored';
  result: any;
}) & {
  call: (...params: Parameters<TFunc>) => void;
  cancel: () => void;
};

type ChildProps = {
  children?: React.ReactNode;
}

export default class Async<TFunc extends (...params: any) => Promise<any>> extends React.Component<AsyncProps<TFunc>, AsyncContextType<TFunc>> {
  private AsyncContext: React.Context<AsyncContextType<TFunc>>;

  private readonly abortController: AbortController;

  constructor(props: AsyncProps<TFunc>) {
    super(props);
    const abortController = new AbortController();
    this.abortController = abortController;

    const promiseFunc = async (...args: Parameters<TFunc>) => {
      this.setState({ status: 'loading' });
      try {
        const result = await props.func(...args);
        this.setState({
          status: 'done',
          result,
        });
      } catch (error) {
        this.setState({
          status: 'errored',
          result: error,
        });
      }
    };

    this.state = {
      status: 'initial',
      result: undefined,
      call: (...args: Parameters<TFunc>) => new Promise<void>((resolve, reject) => {
        promiseFunc(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => abortController.signal.removeEventListener('abort', reject));

        abortController.signal.addEventListener('abort', reject);
      }),
      cancel: () => abortController.abort(),
    };
    this.AsyncContext = React.createContext<AsyncContextType<TFunc>>(this.state);
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public Initial = ({ children }: ChildProps) => {
    const { status } = React.useContext(this.AsyncContext);

    if (status === 'initial') return children ?? <LoadingScreen />;
    else return null;
  };

  public Loading = ({ children }: ChildProps) => {
    const { status } = React.useContext(this.AsyncContext);

    if (status === 'loading') return children ?? <LoadingScreen />;
    else return null;
  };

  public Errored = ({ children }: ChildProps) => {
    const { status, result } = React.useContext(this.AsyncContext);

    if (status === 'errored') return children ?? <ErrorScreen error={result.toString()} />;
    else return null;
  };

  public Done = ({ children }: { children: React.ReactNode | ((result: Awaited<TFunc>) => React.ReactNode)}) => {
    const { status, result } = React.useContext(this.AsyncContext);
    if (status === 'done') return typeof children === 'function' ? children(result) : children;
    return null;
  };

  public render() {
    const Context = this.AsyncContext;
    return <Context.Provider value={this.state}>{this.props.children}</Context.Provider>;
  }
}
