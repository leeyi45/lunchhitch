/* eslint-disable react/display-name */
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';

export default function TestPage() {
  const options = ['1', '2', '3', '4'];
  const [field, setField] = React.useState('');

  return (
    <Stack direction="column">
      <TextField
        onChange={(event) => setField(event.target.value)}
        value={field}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>),
        }}
      />
      <ol>
        {(field === '' ? options : options.filter((x) => x.search(field))).map((x, i) => (<li key={i}>{x}</li>))}
      </ol>
    </Stack>
  );
}
