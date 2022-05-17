/**
 * Custom sign in page design
 * Based on this example: https://github.com/ndom91/next-auth-example-sign-in-page
 */

import { Button } from "@blueprintjs/core";
import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }: any) {
    if (!providers) {
        return <text>No providers :(</text>
    }

    const provider = providers[0];

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        alignContent: 'center',
        justifyContent: 'center',
    }}>
        <text style={{
            marginBottom: '10px'
        }}>Username:</text>
        <input type='text' />
        <text style={{
            marginBottom: '10px',
        }}>Password:</text>
        <input type='password' />
        <Button 
            style={{
                marginTop: '10px',
            }}
            onClick={() => signIn(provider.id)}
        >
            Sign In
        </Button>
    </div>;
}

export async function getServerSideProps(context: any) {
    const providers = await getProviders();
    return {
        props: { providers },
    }
}