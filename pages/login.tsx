import React from 'react';
import { useSession } from 'next-auth/react';

import { Button } from '@blueprintjs/core';

const LoginPage = (provider: any) => {
   const { data: session } = useSession();
   const [wrongCreds, setWrongCreds] = React.useState(false);

   if (session) {
       // user is logged in
       return <></>
   } else {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '70%',
            alignContent: 'center',
            justifyContent: 'center',
        }}>
            {wrongCreds ? <text style={{
                marginBottom: '10px',
            }}>No such username or password</text>: undefined}
            <text style={{
                marginBottom: '10px'
            }}>Username:</text>
            <input type='text' />
            <text style={{
                marginBottom: '10px',
            }}>Password:</text>
            <input type='password' />
            <Button style={{
                marginTop: '10px',
            }}>Sign In</Button>
        </div>);
   }
};


export default LoginPage;
