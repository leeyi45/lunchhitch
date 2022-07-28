import type { GetServerSideProps, GetServerSidePropsContext, PreviewData } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { getSession } from '../firebase/admin';

export default function SSRAuthHandler<T>(redirect?: URL) {
  return (
    getProps: (data: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> & { username: string }) => Promise<T>,
  ): GetServerSideProps<T> => async (ctx) => {
    const username = await getSession(ctx.req.cookies.token);

    if (!username) {
      return {
        redirect: {
          destination: redirect ?? `/auth/login?callback=${encodeURIComponent(ctx.resolvedUrl)}`,
        },
        props: {} as never,
      };
    } else {
      return {
        props: await getProps({
          ...ctx,
          username,
        }),
      };
    }
  };
}
