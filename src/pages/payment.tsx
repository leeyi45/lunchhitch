import React from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

const OrderSwitch = styled(Switch)(({ theme }) => ({
  padding: 7,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    BackgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#8BE796',
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#8BE796',
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#ff4d4d',
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function PaymentPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'raleway', fontSize: '90px', fontWeight: 'bold' }}>Payment</h1>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontFamily: 'raleway' }}>Ordering</Typography>
        <EventNoteIcon />
        <OrderSwitch
          inputProps={{ 'aria-label': 'ant design' }}
          color="secondary"
        />
        <TwoWheelerIcon />
        <Typography sx={{ fontFamily: 'raleway' }}>On the way</Typography>
      </Stack>
    </div>
  );
}
