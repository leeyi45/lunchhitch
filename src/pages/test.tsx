import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

export default function TestPage() {
  const things = [
    { id: 1, value: 2 },
    { id: 2, value: 2 },
    { id: 3, value: 2 },
  ];

  return (
    <Autocomplete
      options={things}
      renderOption={(props, option) => (
        <>
          <p>id: {option.id}</p>
          <p>Value: {option.value}</p>
        </>
      )}
      renderInput={(params) => (<TextField {...params} label="Test" />)}
      getOptionLabel={(option) => option.id.toString()}
    />
  );
}
