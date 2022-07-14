/* eslint-disable no-shadow */
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Shop } from '@prisma/client';

import { useNullableState } from '../../common';
import { LunchHitchCommunity } from '../../prisma';

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
      }}
      spacing={1}
    >
      <Autocomplete
        style={{
          paddingTop: '20px',
        }}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={communities}
        onChange={(_event, value) => setCommunity(value)}
        renderInput={(params) => (<TextField {...params} label="Community" />)}
        renderOption={(liProps, option) => (
          <ListItem {...liProps}>
            <div>
              <h1>{option.name}</h1>
              {option.address}
            </div>
          </ListItem>
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
        options={community?.shops ?? []}
        renderInput={(params) => (<TextField {...params} label="Shop" />)}
        renderOption={(liProps, option) => (
          <ListItem {...liProps}>
            {option.name}
          </ListItem>
        )}
        value={shop}
      />
    </Stack>
  );
}
