/* eslint-disable no-shadow */
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import ButtonBase from '@mui/material/ButtonBase';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Shop } from '@prisma/client';

import { useNullableState } from '../../common';
import { LunchHitchCommunity } from '../../prisma';

import styles from './orders.module.css';

type Props = {
  /**
   * Communities available to be selected
   */
  communities: LunchHitchCommunity[];

  /**
   * Event fired when the value of the selected shop changes
   */
  onChange: (newValue: Shop | null) => void;

  /**
   * Value of the selected shop
   */
  value: Shop | null;
};

// background images
const eusoff = {
  url: '../../common/media/eusoff.jpg',
  title: 'Eusoff',
};
const niqqis = {
  url: '../../common/media/niqqis.jpg',
  title: 'Niqqis',
};

/* Button base */
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

/**
 * Autocomplete selectors to select a community and shop
 */
export default function ShopSelector({ communities, onChange, value }: Props) {
  const [community, setCommunity] = useNullableState<LunchHitchCommunity>();
  const [shop, setShop] = useNullableState<Shop>(value);

  React.useEffect(() => setShop(value), [value]);

  return (
    <Stack
      direction="column"
      style={{
        margin: '10px, 10px, 10px, 10px',
        paddingTop: '20px',
      }}
      spacing={1}
    >
      <Autocomplete
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={communities}
        onChange={(_event, value) => setCommunity(value)}
        style={{ backgroundColor: 'rgba(152, 255, 152, 0.3)' }}
        renderInput={(params) => (<TextField {...params} label="Community" />)}
        renderOption={(liProps, option) => (
          <Stack direction="row">
            <ListItem {...liProps}>
              <ImageButton
                focusRipple
                key={eusoff.title}
                style={{
                  fontFamily: 'raleway',
                  height: '325px',
                  width: '100%',
                }}
              >
                <ImageSrc className={styles.eusoff} />
                <ImageBackdrop className="MuiImageBackdrop-root" />
                <Image>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="inherit"
                    sx={{
                      position: 'relative',
                      p: 4,
                      pt: 2,
                      pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                    }}
                  >
                    <h1>{option.name}</h1>
                    {option.address}
                    <ImageMarked className="MuiImageMarked-root" />
                  </Typography>
                </Image>
              </ImageButton>
            </ListItem>
            <ListItem>
              <ImageButton
                focusRipple
                key="coming soon"
                style={{
                  fontFamily: 'raleway',
                  height: '325px',
                  width: '50%',
                }}
              >
                <ImageSrc className={styles.comingSoon} />
                <ImageBackdrop className="MuiImageBackdrop-root" />
                <Image>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="inherit"
                    sx={{
                      position: 'relative',
                      p: 4,
                      pt: 2,
                      pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                    }}
                  >
                    <h1>More coming soon</h1>
                    <ImageMarked className="MuiImageMarked-root" />
                  </Typography>
                </Image>
              </ImageButton>
            </ListItem>
          </Stack>
        )}
        value={community}
      />
      <Autocomplete
        disabled={community === null}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_event, value) => {
          setShop(value);
          onChange(value);
        }}
        style={{ backgroundColor: 'rgba(152, 255, 152, 0.3)' }}
        options={community?.shops ?? []}
        renderInput={(params) => (<TextField {...params} label="Shop" />)}
        renderOption={(liProps, option) => (
          <Stack direction="row">
            <ListItem {...liProps} style={{ width: '30%' }}>
              <ImageButton
                focusRipple
                key={niqqis.title}
                style={{
                  fontFamily: 'raleway',
                  height: '290px',
                  width: '100%',
                }}
              >
                <ImageSrc className={styles.niqqis} />
                <ImageBackdrop className="MuiImageBackdrop-root" />
                <Image>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="inherit"
                    sx={{
                      position: 'relative',
                      p: 4,
                      pt: 2,
                      pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                    }}
                  >
                    {option.name}
                    <ImageMarked className="MuiImageMarked-root" />
                  </Typography>
                </Image>
              </ImageButton>
            </ListItem>
            <ListItem style={{ width: '30%' }}>
              <ImageButton
                focusRipple
                key="coming soon"
                style={{
                  fontFamily: 'raleway',
                  height: '290px',
                  width: '80%',
                }}
              >
                <ImageSrc className={styles.comingSoon} />
                <ImageBackdrop className="MuiImageBackdrop-root" />
                <Image>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="inherit"
                    sx={{
                      position: 'relative',
                      p: 4,
                      pt: 2,
                      pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                    }}
                  >
                    <h1>More coming soon</h1>
                    <ImageMarked className="MuiImageMarked-root" />
                  </Typography>
                </Image>
              </ImageButton>
            </ListItem>
          </Stack>
        )}
        value={shop}
      />
    </Stack>
  );
}
