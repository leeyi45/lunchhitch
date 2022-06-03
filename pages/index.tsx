import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
// import FIREBASE_AUTH from '../firebase/auth';
import NavBar from '../common/navbar';

type Location = {
    name: string;
    locations: string[];
}

export default function HomePage(props: { locations: Location[] }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [locInputValue, setLocInputValue] = React.useState<string>('');

  const menu = (
    <Menu>
      {props.locations.map((x, i) => (
        <MenuItem
          key={i}
          onClick={() => setLocInputValue(x.name)}
          text={x.name}
        />
      ))}
    </Menu>
  );

  // eslint-disable-next-line no-shadow
  onAuthStateChanged(getAuth(), (user) => {
    console.log('auth state changed');
    if (user) {
      console.log(`${user?.displayName} has signed in!`);
      setUser(user);
    } else {
      console.log('User is undefined');
    }
  });

  const selectedLocation = props.locations.find((x) => x.name === locInputValue);

  return (
    <div>
      <NavBar user={user} />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
      }}
      >
        <div>
          <p>Select Your Location:</p>
          <Popover2 className="bp4-menu" content={menu}>
            <input value={locInputValue} />
          </Popover2>
        </div>
        <div>
          {selectedLocation !== undefined
            ? (
              <ol>
                {selectedLocation.locations.map((x) => <li>{x}</li>)}
              </ol>
            )
            : undefined}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/locations');
  const { locations } = await res.json();

  return {
    props: {
      locations,
    },
  };
}
