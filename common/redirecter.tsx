import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
    /**
     * String representing the URL path to redirect the user to
     */
    redirect: string;
    /**
     * Duration, in seconds, before the redirect occurs
     */
    duration: number;
    children: any;
}

export default function Redirecter({ redirect, duration, children }: Props) {
  const router = useRouter();
  const startTimeRef = React.useRef<number | null>(null);

  const countCallback = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    } else if (timestamp - startTimeRef.current >= duration) {
      router.push(redirect);
      return;
    }
    requestAnimationFrame(countCallback);
  };

  React.useEffect(() => { requestAnimationFrame(countCallback); }, []);

  return (
    <div>
      {children}
      <p>
        Click
        {' '}
        <Link href={redirect}>here</Link>
        {' '}
        if you are not automatically redirected
      </p>
    </div>
  );
}
