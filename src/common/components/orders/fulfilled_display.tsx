import React from 'react';
import type { AsyncConstructor } from 'react-async';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Stack from '@mui/material/Stack';

import type { LunchHitchOrder } from '../../../prisma/types';
import Box from '../Box';
import TooltipButton from '../tooltip_button';

import OrdersDisplay, { AsyncWrapper } from './orders_display';

const FulfilledItemHeader = ({ order }: { order: LunchHitchOrder }) => (
  <Stack direction="row">
    <h3>Ordered by {order.from.displayName}</h3>
    <TooltipButton
      tooltip="Cancel this order"
    >
      <DeleteIcon />
    </TooltipButton>
  </Stack>
);

type Props = {
  Async: AsyncConstructor<LunchHitchOrder[]>;
}

export default function FulfilledDisplay({ Async }: Props) {
  return (
    <Box style={{ backgroundColor: 'rgba(154, 184, 252, 0.5)' }}>
      <AsyncWrapper<LunchHitchOrder[]> Async={Async}>
        {(data, { run }) => (
          <OrdersDisplay
            orders={data}
            empty={<p>You have no orders to fulfill</p>}
            header={(
              <Stack direction="row" spacing={1}>
                <h2 style={{ color: '#47b16a' }}>Orders you have to fulfill</h2>
                <TooltipButton
                  style={{
                    float: 'right',
                  }}
                  tooltip="Refresh orders"
                  onClick={() => run()}
                >
                  <RefreshIcon />
                </TooltipButton>
              </Stack>
            )}
            OrderHeader={FulfilledItemHeader}
          />
        )}
      </AsyncWrapper>
    </Box>
  );
}
