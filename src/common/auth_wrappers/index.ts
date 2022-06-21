import { useRouter } from 'next/router';
import { LunchHitchUser, useSession } from '../../auth';
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
  const { user } = useSession({
    required: true,
    onUnauthenticated: () => router.push('/auth/login'),
  });

  // User will never be null here because of the router redirect
  return children(user!);
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

  if (status === 'authenticated') router.push(redirect);
  else if (status === 'loading') return 'Loading...';

  return children;
}

export { AuthSelector };
