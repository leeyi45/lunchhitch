import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type Props = {
    children: any;
}

/**
 * Wrap child components with this component if they require the user to be logged in.
 * Unauthenticated users are redirected to the login page automatically
 */
export default function AuthRequired({ children }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!session || !session.user) router.push('/auth/login');
  }, [session]);

  return children;
}
