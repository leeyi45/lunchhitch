import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useSession } from 'next-auth/react';
import { location, PrismaClient } from '@prisma/client';
import NavBar from '../common/navbar';

export default function HomePage(props: { locations: location[] }) {
  const [locInputValue, setLocInputValue] = React.useState<string>('');
  const { data: session } = useSession();

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
      <NavBar user={session?.user} />
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
  const prisma = new PrismaClient();
  const locations = await prisma.location.findMany();

  return {
    props: {
      locations,
    },
  };
}
