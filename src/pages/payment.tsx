import React from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import ShareIcon from '@mui/icons-material/Share';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

import Prata from '../common/media/prata.png';

import styles from './styles.module.css';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

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
  const [expanded, setExpanded] = React.useState(false);
  const [disable, setDisabled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDisable = () => {
    setDisabled(true);
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.Payment}>
      <Card sx={{ maxWidth: '500px' }}>
        <CardHeader
          title="Order for Niqqi's"
          subheader="Deliver by: " // todo: add delivery time
        />
        <Image
          src={Prata}
          alt="prata"
          height="400px"
        />
        <CardContent>
          <Stack direction="row" style={{ justifyContent: 'center' }}>
            <p style={{ paddingRight: '5px' }}>$</p>
            <TextField
              required
              disabled={disable}
              id="outlined-required"
              label="Quote total cost"
              style={{ width: '50%' }}
            />
            <Button disabled={disable} onClick={handleClickOpen} endIcon={(<SendIcon />)} />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Submit cost?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Once you have checked that the total cost is correct, press confirm to send the fee to the orderer.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus style={{ color: '#50C878' }}>Cancel</Button>
                <Button onClick={handleDisable} autoFocus style={{ color: '#50C878' }}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontFamily: 'raleway' }}>Ordering</Typography>
            <EventNoteIcon />
            <OrderSwitch
              inputProps={{ 'aria-label': 'ant design' }}
              color="success"
            />
            <TwoWheelerIcon />
            <Typography sx={{ fontFamily: 'raleway' }}>On the way</Typography>
          </Stack>
        </CardContent>
        <CardActions>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <p style={{ marginLeft: '190px' }}> View Order Details</p>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              insert dishes in the order
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
