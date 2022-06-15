import React from 'react';
import { LunchHitchUser, useSession } from '../../auth';

type Props = {
    children: [(user: LunchHitchUser) => React.FC, React.FC<{ children: any}>, React.FC<{ children: any}>];
};

function createInstance() {
    function AuthSelector({ children }: Props) {
        const { user, status } = useSession();

        switch(status) {
            case 'authenticated': return children[0](user);
            case 'loading': return children[1];
            case 'unauthenticated': return children[2];
        }
    }

    return Object.assign(AuthSelector, {
        Unauthenticated: ({ children }: { children: any}) => (<>{children}</>),
    })
}

export default createInstance();