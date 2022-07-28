import type { Order } from '@prisma/client';
import { createMocks, RequestMethod } from 'node-mocks-http';

import { APIResult, asApiError, asApiSuccess } from '../api_helpers';
import { UNAUTHORIZED_MSG } from '../api_helpers/api_wrappers';
import testUser from '../auth/test_user';
import ordersHandler, { ordersFilter } from '../pages/api/orders';
import createHandler from '../pages/api/orders/create';
import deleteHandler from '../pages/api/orders/delete';
import fulfillHandler from '../pages/api/orders/fulfill';
import unfulfillHandler from '../pages/api/orders/unfulfill';
import { LunchHitchOrder } from '../prisma/types';
import type { APIRequest, APIResponse } from '../testing/api_mocker';
import { prismaMock } from '../testing/singleton';

jest.mock('../firebase/admin');
jest.mock('../prisma');

const simReq = (
  // eslint-disable-next-line no-unused-vars
  handler: (req: APIRequest, res: APIResponse) => Promise<void>,
) => async (
  token: 'authorized' | 'unauthorized',
  method: RequestMethod,
  body?: any,
  query?: any,
) => {
  const { req, res } = createMocks<APIRequest, APIResponse>({
    method,
    body,
    cookies: {
      token,
    },
    query,
  });

  await handler(req, res);
  return res;
};

const expectRes = (statusCode: number, expectedResult: APIResult<any>) => (res: APIResponse) => {
  expect(res.statusCode).toEqual(statusCode);
  expect(res._getJSONData()).toEqual(expectedResult);
};

const createOrder = (params: Partial<LunchHitchOrder> = {}): LunchHitchOrder => Object.entries(params).reduce((result, [key, value]) => (
  value === undefined ? result : ({
    ...result,
    [key]: value,
  })), {
  id: '1',
  fromId: testUser.username,
  from: {
    username: testUser.username,
    displayName: testUser.displayName,
  },
  fulfiller: null,
  fulfillerId: null,
  shopId: 'testShop',
  shop: {
    name: 'TestShop',
  },
  deliverBy: '2011-10-05T14:48:00.000Z' as unknown as Date,
  orders: [],
  state: 'UNKNOWN',
});

describe('Testing orders API route', () => {
  const mockReq = (
    token: 'authorized' | 'unauthorized',
    method: RequestMethod,
    body: any | undefined,
    value: LunchHitchOrder[],
  ) => {
    prismaMock.order.findMany.mockResolvedValue(value);
    return simReq(ordersHandler)(token, method, body);
  };

  const testOrder = createOrder();

  it('should work while unauthorized', async () => {
    const res = await mockReq('unauthorized', 'POST', undefined, [testOrder]);

    expect(prismaMock.order.findMany).toBeCalledWith(ordersFilter);
    expectRes(200, asApiSuccess([testOrder]))(res);
  });

  it('should work while authorized', async () => {
    const res = await mockReq('authorized', 'POST', undefined, [testOrder]);

    expect(prismaMock.order.findMany).toBeCalledWith(ordersFilter);
    expectRes(200, asApiSuccess([testOrder]))(res);
  });

  test('passing filters', async () => {
    const newFilter = { shopId: 'testShop' };
    const res = await mockReq('unauthorized', 'POST', newFilter, [testOrder]);

    expect(prismaMock.order.findMany).toBeCalledWith({ ...ordersFilter, ...newFilter });
    expectRes(200, asApiSuccess([testOrder]))(res);
  });
});

describe('Testing orders/create API route', () => {
  const mockReq = simReq(createHandler);
  const orderDetails = {
    shopId: 'testShop',
    orders: [],
    deliverBy: '2011-10-05T14:48:00.000Z' as unknown as Date,
  };

  const createdOrder: Order = {
    ...orderDetails,
    id: '1',
    fulfillerId: null,
    fromId: testUser.username,
    state: 'DELIVERING',
  };

  test('regular function', async () => {
    prismaMock.order.create.mockResolvedValue(createdOrder);
    const res = await mockReq('authorized', 'POST', orderDetails);

    expectRes(200, asApiSuccess(createdOrder))(res);
    expect(prismaMock.order.create).toBeCalledWith({ data: createdOrder });
  });

  it('should error when unauthorized', async () => {
    const res = await mockReq('unauthorized', 'POST');
    expectRes(401, asApiError(UNAUTHORIZED_MSG))(res);
  });
});

describe('Testing orders/delete API route', () => {
  const mockReq = simReq(deleteHandler);

  const order = createOrder();

  test('regular function', async () => {
    prismaMock.order.findFirst.mockResolvedValue(order);

    const res = await mockReq('authorized', 'POST', undefined, {
      id: '1',
    });

    expectRes(200, { result: 'success', value: 'Success' })(res);
    expect(prismaMock.order.findFirst).toBeCalledWith({
      where: {
        id: '1',
        fromId: testUser.username,
      },
    });
    expect(prismaMock.order.delete).toBeCalledWith({
      where: {
        id: '1',
      },
    });
  });

  it('should error when unauthorized', async () => {
    const res = await mockReq('unauthorized', 'POST', undefined, {
      id: '1',
    });

    expectRes(401, { result: 'error', value: UNAUTHORIZED_MSG })(res);
  });
});

describe('Testing orders/fulfill API route', () => {
  const mockReq = simReq(fulfillHandler);
  const toFulfill = createOrder();

  test('regular function', async () => {
    const fulfilled = createOrder({ fulfillerId: testUser.username });
    prismaMock.order.findFirst.mockResolvedValue(toFulfill);
    prismaMock.order.update.mockResolvedValue(fulfilled);

    const res = await mockReq('authorized', 'POST', undefined, {
      id: '1',
    });

    expect(prismaMock.order.update).toBeCalledWith({
      where: {
        id: '1',
      },
      data: {
        fulfillerId: testUser.username,
      },
    });
    expectRes(200, asApiSuccess(fulfilled))(res);
  });

  it('should error when unauthorized', async () => {
    const res = await mockReq('unauthorized', 'POST', undefined, {
      id: '1',
    });

    expectRes(401, { result: 'error', value: UNAUTHORIZED_MSG })(res);
  });
});

describe('Testing orders/unfulfill API route', () => {
  const mockReq = simReq(unfulfillHandler);

  test('regular function', async () => {
    const fulfilled = createOrder({ fulfillerId: testUser.username });

    prismaMock.order.findFirst.mockResolvedValue(fulfilled);
    const res = await mockReq('authorized', 'POST', undefined, {
      id: '1',
    });

    expect(prismaMock.order.update).toBeCalledWith({
      where: {
        id: '1',
      },
      data: {
        fulfillerId: null,
      },
    });
    expectRes(200, asApiSuccess('Success'))(res);
  });

  it('should error when unauthorized', async () => {
    const res = await mockReq('unauthorized', 'POST', undefined, {
      id: '1',
    });

    expectRes(401, { result: 'error', value: UNAUTHORIZED_MSG })(res);
  });
});
