import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { UserInfo } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Image from 'next/image';

import ErrorScreen from '../../common/auth_selector/error_screen';
import Box from '../../common/components/Box';
import NavBar from '../../common/components/navbar';
import Onigiri from '../../common/media/onigiri.jpg';
import { getSession } from '../../firebase/admin';
import prisma from '../../prisma';

import styles from './profile.module.css';

type Props = {
  user: UserInfo | null;
};

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '250px',
  height: '85px',
}));

const ProfileDisplay = ({ user }: { user: UserInfo }) => (
  <div className={styles.Background}>
    <NavBar user={user} />
    <Box style={{
      display: 'flex',
      flexDirection: 'column',
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: '40%',
      top: '20%',
      textAlign: 'center',
      borderRadius: '10px',
    }}
    >
      <Stack spacing={2} alignItems="center">
        <div className={styles.Border}>
          <Image
            src={Onigiri}
            alt="Profile Picture"
            height="110px"
            width="110px"
          />
        </div>
        <Tooltip title="Your display name" placement="right" arrow><h1>{user.displayName}</h1></Tooltip>
        <Tooltip title="Your username" placement="right" arrow><p>{user.username}</p></Tooltip>
        <Item style={{ background: 'linear-gradient(to right, #abebb3, #88a0f7, #c2c2fc)' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EmailIcon sx={{ marginLeft: '8px' }} />
            <Stack direction="column" sx={{ textAlign: 'left', lineHeight: '50%', paddingLeft: '15px' }}>
              <p>EMAIL</p>
              <p>{user.email}</p>
            </Stack>
          </Stack>
        </Item>
        <Item style={{ background: 'linear-gradient(to right, #abebb3, #88a0f7, #c2c2fc)' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneIcon sx={{ marginLeft: '8px' }} />
            <Stack direction="column" sx={{ textAlign: 'left', lineHeight: '50%', paddingLeft: '15px' }}>
              <p>MOBILE</p>
              <p>{user.phoneNumber}</p>
            </Stack>
          </Stack>
        </Item>
      </Stack>
    </Box>
  </div>
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
