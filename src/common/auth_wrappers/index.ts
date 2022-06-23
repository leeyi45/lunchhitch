import { useRouter } from 'next/router';
import { LunchHitchUser } from '../../auth/auth';
import { useSession } from '../../auth/auth_provider';
import AuthSelector from './auth_selector';

type Props = {
    // eslint-disable-next-line no-unused-vars
    children: (user: LunchHitchUser) => any;
};

/**
 * Wrap child components with this component if they require the user to be logged in.
 * Unauthenticated users are redirected to the login page automatically
 */
export function AuthRequired({ children }: Props) {
  const router = useRouter();
  const { status, user } = useSession();

  if (status === 'authenticated') return children(user);

  router.push('/auth/login');
  return user as never;
}

type RedirectProps = {
  children: any;
  redirect: string;
}

/**
 * Wrap child components if the they require the user to be logged out
 * Authenticated users are redirected to the given redirect
 */
export function RedirectOnAuth({ redirect, children }: RedirectProps) {
  const router = useRouter();
  const { status } = useSession();

  if (status === 'authenticated') {
    router.push(redirect);
    return undefined as never;
  }
  else if (status === 'loading') return 'Loading...';

  return children;
}

export { AuthSelector };
