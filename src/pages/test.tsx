import React from 'react';
import { Button, Stack } from '@mui/material';

import { LinkedClickAwayPopover, LinkedPopover, PopoverContainer } from '../common/popovers/linked_popovers';

export default function TestPage() {
  return (
    <PopoverContainer
      popovers={{
        popover1: (
          <LinkedPopover name="popover1">
            {(setOpen) => (
              <div>
                <Button
                  onClick={() => setOpen(false)}
                >Close
                </Button>
              </div>
            )}
          </LinkedPopover>
        ),
        popover2: (
          <LinkedClickAwayPopover name="popover2">
            {(setOpen) => (
              <div>
                <Button onClick={() => setOpen(false)}>Funky
                </Button>
              </div>
            )}
          </LinkedClickAwayPopover>
        ),
      }}
    >
      {(_values, setValue) => (
        <Stack direction="column">
          Some other content
          <Button onClick={() => setValue('popover1', true)}>Open</Button>
          <Button onClick={() => setValue('popover2', true)}>Open</Button>
        </Stack>
      )}
    </PopoverContainer>
  );
}
