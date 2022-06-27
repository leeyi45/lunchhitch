import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import NavBar from '../common/navbar';
import { LunchHitchUser } from '../auth';
import AuthSelector from '../common/auth_selector';

type Props = {
  user: LunchHitchUser;
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

const ProfileDisplay = ({ user }: Props) => (
  <>
    <NavBar user={user} />
    <Stack spacing={1} style={{ alignItems: 'center', color: '#47b16a' }}>
      <h1>My Profile</h1>
      <h3>Name:</h3>
      <Item>test</Item>
      {/*<Item>{user.displayName}</Item>*/}
      <h3>Username:</h3>
      <Item>test</Item>
      {/*<Item>{user.username}</Item>*/}
      <h3>Email:</h3>
      <Item>test@lunchhitch.firebaseapp.com</Item>
      {/*<Item>{user.email}</Item>*/}
    </Stack>
  </>
);

export default function ProfilePage() {
  return (
    <AuthSelector>
      {(user) => (<ProfileDisplay user={user} />)}
    </AuthSelector>
  );
}
