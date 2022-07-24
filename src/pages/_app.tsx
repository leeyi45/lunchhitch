/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { AppProps } from 'next/app';

import { AuthProvider } from '../auth/auth_provider';

import '../styles/globals.css';

// const theme = createTheme({
//   typography: {
//     fontFamily: [
//       'Raleway',
//       'sans-serif',
//     ].join(','),
//   },
// });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
