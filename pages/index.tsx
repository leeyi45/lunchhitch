import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { User } from "firebase/auth";
import { FIREBASE_AUTH } from '../firebase/auth'
import { useState } from "react";
import NavBar from "../common/navbar";

export default function HomePage(props: { locations: string[] }) {
    const [user, setUser] = useState<User | null>(null);
    const [locInputValue, setLocInputValue] = useState('');

    const menu = <Menu>
        {props.locations.map((x, i) => (
        <MenuItem key={i} text={x} onClick={() => setLocInputValue(x)}/>))}
    </Menu>
    
    FIREBASE_AUTH.onAuthStateChanged(user => {
        if (user) setUser(user);
    });

    return <div>
        <NavBar user={user} />
        <div>
            <p>Select Your Location:</p>
            <Popover2 className='bp4-menu' content={menu} >
                <input value={locInputValue} />
                <Button icon='arrow-down' />
            </Popover2>
        </div>
    </div>
};

export async function getServerSideProps() {
    const res = await fetch('http://localhost:3000/api/locations')
    const locations = (await res.json()).locations

    return {
        props: {
            locations,
        }
    }
}
