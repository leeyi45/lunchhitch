import React from 'react';
import { useRouter } from 'next/router';

import { useSession } from '../../auth/auth_provider';
import testUser from '../../auth/test_user';
import LoadingScreen from '../loading_screen';

import ErrorScreen from '../error_screen';

type Props = ({
  /**
   * If provided a string, the user will be redirected to that page on authentication\
   * Otherwise a React component can be provided
   */
  children: React.ReactElement<any> | ((user: { username: string, displayName: string }) => React.ReactElement<any>);
  authenticated: undefined;
} | {
  children: undefined;
  authenticated: URL | (() => void);
}) & {
  /**
   * Provide a string to redirect the user when they are not logged in\
   * or a React component to display\
   * Set to null or undefined to redirect the user to the login page
   */
  unauthenticated?: React.ReactElement<any> | URL | null;

  /**
   * Provide a string to redirect the user to while waiting for the session to load\
   * or a React component to display\
   * Set to null or undefined to display the default loading screen
   */
  loading?: React.ReactElement<any> | URL | null;

  force?: boolean;
};

/**
 * Component for displaying different results based on the current authentication status
 */
export default function AuthSelector(props: Props) {
  const router = useRouter();
  const { user, status, error } = useSession();

  // Wrap router usage in useEffect
  React.useEffect(() => {
    if (props.force) return;

    if (status === 'unauthenticated') {
      if (!props.unauthenticated) {
        router.push(`/auth/login?callback=${encodeURIComponent(router.pathname)}`);
      } else if (props.unauthenticated instanceof URL) {
        router.push(props.unauthenticated);
      }
    } else if (status === 'loading' && props.loading instanceof URL) {
      router.push(props.loading);
    } else if (status === 'authenticated' && props.authenticated instanceof URL) {
      router.push(props.authenticated);
    }
  }, [status, props]);

  if (process.env.NODE_ENV !== 'production' && props.force) {
    if (props.authenticated) {
      if (!(props.authenticated instanceof URL)) props.authenticated();
      return null as never;
    } else if (typeof props.children === 'function') {
      return props.children({
        username: testUser.username,
        displayName: testUser.displayName,
      });
    } else {
      return props.children!;
    }
  }
  switch (status) {
    case 'authenticated': {
      if (props.authenticated) {
        if (!(props.authenticated instanceof URL)) props.authenticated();
        return null as never;
      } else if (typeof props.children === 'function') {
        return props.children(user);
      } else {
        return props.children!;
      }
    }
    case 'unauthenticated': {
      if (props.unauthenticated && !(props.unauthenticated instanceof URL)) {
        return props.unauthenticated;
      } else return null as never;
    }
    case 'loading': {
      if (!props.loading) {
        return <LoadingScreen />;
      } else if (!(props.loading instanceof URL)) {
        return props.loading;
      } else return null as never;
    }
    case 'errored': return <ErrorScreen error={error.toString()} />;
    default: return null as never;
  }
}

AuthSelector.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  authenticated: undefined,
  unauthenticated: null,
  loading: null,
  force: false,
};
