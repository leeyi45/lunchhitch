import { useRouter } from 'next/router';
import { onAuthStateChanged } from '@firebase/auth';
import { FIREBASE_AUTH } from '../firebase';

type Props = {
    children: any;
}

/**
 * Wrap child components with this component if they require the user to be logged in.
 * Unauthenticated users are redirected to the login page automatically
 */
export default function AuthRequired({ children }: Props) {
  const router = useRouter();
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if (user) router.push('/auth/login');
  });

  return children;
}
