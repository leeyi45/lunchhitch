import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  // pages: {
  //   signIn: '/auth/sigin',
  // },
  // Configure one or more authentication providers
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({token, account}) {
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    }
  },
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here
    CredentialsProvider({
      name: 'LunchHitch Account',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'yeet' },
        password: { label: 'Password', type: 'password'}
      },
      async authorize(credentials) {
        // Retrieve credential information from somewhere
        return {
          username: 'thingy',
        };

        const res = await fetch('localhost:8000', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' }
        });

        const user = await res.json();

        return res.ok && user ? user : null;
      }
    })
  ],
})