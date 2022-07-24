/* eslint-disable react/display-name */
import React from 'react';
import {
  Async, IfFulfilled, IfInitial, IfPending, PromiseFn, useAsync,
} from 'react-async';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, CircularProgress, Stack } from '@mui/material';

import { fetchApiThrowOnError } from '../api_helpers';
import Box from '../common/components/Box';
import { LunchHitchOrder } from '../prisma/types';

const promiseFn: PromiseFn<LunchHitchOrder[]> = ({ id }, controller) => fetchApiThrowOnError<LunchHitchOrder[]>('orders', {
  where: {
    fromId: 'TestUser',
  },
});

export default () => {
  const [inputState, setInputState] = React.useState('');
  const stuff = useAsync<LunchHitchOrder[]>({
    promiseFn,
    id: 'TestUser',
  });

  React.useEffect(() => console.log(stuff.isPending), [stuff.isPending]);

  return (
    <Stack direction="column">
      <Box>
        <Stack direction="column">
          <Button onClick={() => {
            stuff.cancel();
            stuff.run(inputState);
          }}
          >
            <RefreshIcon />
          </Button>
          <input value={inputState} onChange={(event) => setInputState(event.target.value)} type="text " />
          <IfInitial state={stuff}>Initial...</IfInitial>
          <IfPending state={stuff}>
            <CircularProgress />
          </IfPending>
          <IfFulfilled state={stuff}>
            {(data) => (
              <div>
                <ol>

                  {data.map((each, i) => (<li key={i}>{each.id}</li>))}
                </ol>
              </div>
            )}
          </IfFulfilled>
        </Stack>
      </Box>
      <Box>
        <Async promiseFn={promiseFn}>
          <Async.Pending>
            <CircularProgress />
          </Async.Pending>
          <Async.Fulfilled>
            {(data: LunchHitchOrder[]) => (
              <div>
                <ol>
                  {data.map((each, i) => (<li key={i}>{each.id}</li>))}
                </ol>
              </div>
            )}
          </Async.Fulfilled>
        </Async>
      </Box>
    </Stack>
  );
};
