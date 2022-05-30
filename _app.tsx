import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Router } from 'react-router'

export default function MyApp({Component, pageProps: { session, ...pageProps}}: AppProps) {
  return <Component {...pageProps} />
}
