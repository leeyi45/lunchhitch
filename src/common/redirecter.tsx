import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  const animFrameRef = React.useRef<number | null>(null);
  const [count, setCount] = React.useState(duration);

  const countCallback = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    } else if (timestamp - startTimeRef.current >= duration) {
      router.push(redirect);
      return;
    } else {
      setCount(Math.round(duration - (timestamp - startTimeRef.current) / 1000));
    }
    animFrameRef.current = requestAnimationFrame(countCallback);
  };

  React.useEffect(() => {
    animFrameRef.current = requestAnimationFrame(countCallback);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div>
      {children}
      <p>
        Click <Link href={redirect}>here</Link> if you are not automatically redirected
      </p>
      <p>Redirecting in {count}...</p>
    </div>
  );
}
