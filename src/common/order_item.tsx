import React from 'react';
import { Order } from '@prisma/client';

export default function OrderItem({ order }: { order: Order }) {
  return (
    <>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <h3>Order from Niqqi's</h3>
      <ol>
        {order.orders.map((item, i) => (
          <li key={i}>
            {item}
          </li>
        ))}
      </ol>
    </>
  );
}
