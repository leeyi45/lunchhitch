import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Location } from '@prisma/client';
import { onAuthStateChanged, User } from '@firebase/auth';
import NavBar from '../common/navbar';
import { FIREBASE_AUTH } from '../firebase';
import prisma from '../prisma';

export default function HomePage(props: { locations: Location[] }) {
  const [locInputValue, setLocInputValue] = React.useState<string>('');
  const [user, setUser] = React.useState<User | null>(null);

  onAuthStateChanged(FIREBASE_AUTH, setUser);

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
                {selectedLocation.stores.map((x) => <li>{x}</li>)}
              </ol>
            )
            : undefined}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const locations = await prisma.location.findMany();

  return {
    props: {
      locations,
    },
  };
}
