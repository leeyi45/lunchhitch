import { Community } from '@prisma/client';
import React from 'react';
import { AuthRequired } from '../../common/auth_wrappers';
import prisma from '../../prisma';
import FulFillForm from './fulfill_form';
import { MakeForm } from './make_form';

type Props = {
  communities: Community[];
}

export default function OrdersPage(props: Props) {
  return (
    <AuthRequired>
      {(user) => (
      <div>
        <MakeForm user={user} communities={props.communities} />
        <FulFillForm user={user} communities={props.communities} />
      </div>
      )}
    </AuthRequired>
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
