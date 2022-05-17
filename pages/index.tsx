import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

const HomePage: NextPage = () => {
    const { data: session } = useSession();
    
    if (!session) signIn();

    return <div>
        <h1>Lunchhitch landing page</h1>
    </div>
};

export default HomePage;
