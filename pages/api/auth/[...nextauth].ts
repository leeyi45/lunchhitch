import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  pages: {
    signIn: '/auth/sigin',
  },
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
    CredentialsProvider({
      name: 'LunchHitch Account',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'yeet' },
        password: { label: 'Password', type: 'password'}
      },
      async authorize(credentials, req) {
        // Retrieve credential information from somewhere

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