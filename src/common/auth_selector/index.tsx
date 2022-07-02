import { useRouter } from 'next/router';
import React from 'react';
import { LunchHitchUser } from '../../auth';
import { useSession } from '../../auth_provider';
import LoadingScreen from './loading_screen';

type Props = ({
  /**
   * If provided a string, the user will be redirected to that page on authentication\
   * Otherwise a React component can be provided
   */
  children: React.ReactElement<any> | ((user: LunchHitchUser) => React.ReactElement<any>);
  authenticated: undefined;
} | {
  children: undefined;
  authenticated: string | (() => void);
}) & {
  /**
   * Provide a string to redirect the user when they are not logged in\
   * or a React component to display\
   * Set to null or undefined to redirect the user to the login page
   */
  unauthenticated?: React.ReactElement<any> | string | null;

  /**
   * Provide a string to redirect the user to while waiting for the session to load\
   * or a React component to display\
   * Set to null or undefined to display the default loading screen
   */
  loading?: React.ReactElement<any> | string | null;
};

export default function AuthSelector({ unauthenticated, loading, ...props }: Props) {
  const router = useRouter();
  const { user, status } = useSession();

  switch (status) {
    case 'authenticated': {
      if (props.authenticated) {
        if (typeof props.authenticated === 'string') router.push(props.authenticated);
        else props.authenticated();

        return null as never;
      } else if (typeof props.children === 'function') {
        return props.children(user);
      } else {
        return props.children!;
      }
    }
    case 'unauthenticated': {
      if (!unauthenticated) {
        router.push(`/auth/login?callback=${router.pathname}`);
        return null as never;
      } else if (typeof unauthenticated === 'string') {
        router.push(unauthenticated);
        return null as never;
      } else return unauthenticated;
    }
    case 'loading': {
      if (!loading) {
        return <LoadingScreen />;
      } else if (typeof loading === 'string') {
        router.push(loading);
        return null as never;
      } else return loading;
    }
    default: return null as never;
  }
}

AuthSelector.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  authenticated: undefined,
  unauthenticated: null,
  loading: null,
};
