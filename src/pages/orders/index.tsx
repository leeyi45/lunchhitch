import Button from '@mui/material/Button';
import { Community } from '@prisma/client';
import React from 'react';
import Box from '../../common/components/Box/Box';
import NavBar from '../../common/navbar';
import prisma from '../../prisma';
import FulFillForm from './fulfill_form';
import { MakeForm } from './make_form';

type Props = {
  communities: Community[];
}

function FulfilOrder() {
  return (<p>yeet</p>);
}

export default function OrdersPage(props: Props) {
  const [makingOrder, setMakingOrder] = React.useState(false);
  const [fulfillingOrder, setFulfillingOrder] = React.useState(false);

  return (
    <div>
      <NavBar />
      <div style={{ display: "flex", flexFlow: "row nowrap"}}>
        <Box>
          <Button onClick={() => {
            setMakingOrder(true);
            setFulfillingOrder(false);
          }}
          style={{color: '#47b16a'}}
          >Make Order
          </Button>
          {makingOrder ? (
            <MakeForm communities={props.communities} />
          ) : undefined}
        </Box>
        <Box>
          <Button onClick={() => {
            setMakingOrder(false);
            setFulfillingOrder(true);
          }}
          style={{color: '#47b16a'}}
          >Fulfil Order
          </Button>
          {fulfillingOrder ? (<FulFillForm communities={props.communities} />) : undefined}
        </Box>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // TODO:
  // Honestly not sure if we should fetch ALL communities server side
  // or load communities as the user types
  const communities = await prisma.community.findMany();

  return {
    props: {
      communities,
    },
  };
}
