import { Autocomplete, ListItem, TextField } from '@mui/material';
import { Community, Shop } from '@prisma/client';
import React from 'react';

type Props = {
  communities: Community[];
  onChange: (newValue: Shop | null) => void;
  value: Shop | null;
};

export default function ShopSelector(props: Props) {
  const [community, setCommunity] = React.useState<Community | null>(null);
  const [shop, setShop] = React.useState<Shop | null>(null);

  return (
    <>
      <Autocomplete
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={props.communities}
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
          props.onChange(value);
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
