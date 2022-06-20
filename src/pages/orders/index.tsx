import Button from '@mui/material/Button';
import { Community } from '@prisma/client';
import React from 'react';
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
      <div>
        <Button onClick={() => {
          setMakingOrder(true);
          setFulfillingOrder(false);
        }}
        >Make Order
        </Button>
        {makingOrder ? (
          <MakeForm communities={props.communities} />
        ) : undefined}
      </div>
      <Button onClick={() => {
        setMakingOrder(false);
        setFulfillingOrder(true);
      }}
      >Fulfil Order
      </Button>
      {fulfillingOrder ? (<FulFillForm communities={props.communities} />) : undefined}
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
