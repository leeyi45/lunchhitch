import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { GetServerSideProps } from 'next';

import { SessionUserWithProfile } from '../../common';
import ErrorScreen from '../../common/auth_selector/error_screen';
import NavBar from '../../common/components/navbar';
import { getSession } from '../../firebase/admin';
import prisma from '../../prisma';

type Props = {
  user: SessionUserWithProfile | null;
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '250px',
  height: '30px',
}));

const ProfileDisplay = ({ user }: { user: SessionUserWithProfile }) => (
  <>
    <NavBar user={user} />
    <Stack spacing={2} style={{ alignItems: 'center', color: '#47b16a' }}>
      <h1>My Profile</h1>
      <h3>Name:</h3>
      <Item>{user.displayName}</Item>
      <h3>Username:</h3>
      <Item>{user.username}</Item>
      <h3>Email:</h3>
      <Item>{user.email}</Item>
      <h3>Phone Number:</h3>
      <Item>{user.phoneNumber}</Item>
    </Stack>
  </>
);

export default function ProfilePage({ user }: Props) {
  return !user ? (<ErrorScreen error="Error loading user" />) : <ProfileDisplay user={user} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const username = await getSession(ctx.req.cookies.token);

  if (!username) {
    return {
      redirect: {
        destination: `/auth/login?callback=${encodeURIComponent(ctx.resolvedUrl)}`,
      },
      props: null as never,
    };
  } else {
    const user = await prisma.userInfo.findFirst({
      where: {
        username,
      },
    });
    return {
      props: {
        user,
      },
    };
  }
};
