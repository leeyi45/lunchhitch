/* eslint-disable no-shadow */
import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Community, Shop } from '@prisma/client';
import React from 'react';

type Props = {
  /**
   * Communities available to be selected
   */
  communities: Community[];

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
  const [community, setCommunity] = React.useState<Community | null>(null);
  const [shop, setShop] = React.useState<Shop | null>(value);

  React.useEffect(() => setShop(value), [value]);

  return (
    <>
      <Autocomplete
        style={{
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={communities}
        filterOptions={(x) => x}
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
        style={{
          paddingBottom: '20px',
        }}
        disabled={community === null}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_event, value) => {
          setShop(value);
          onChange(value);
        }}
        options={community !== null ? community.shops : []}
        renderInput={(params) => (<TextField {...params} label="Shop" />)}
        renderOption={(liProps, option) => (
          <ListItem {...liProps}>
            {option.name}
          </ListItem>
        )}
        value={shop}
      />
    </>
  );
}
