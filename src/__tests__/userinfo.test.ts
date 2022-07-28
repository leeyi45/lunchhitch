import { createMocks, RequestMethod } from 'node-mocks-http';

import testUser from '../auth/test_user';
import getHandler from '../pages/api/userinfo';
import createHandler from '../pages/api/userinfo/create';
import type { APIRequest, APIResponse } from '../testing/api_mocker';
import { prismaMock } from '../testing/singleton';

jest.mock('../firebase/admin');
jest.mock('../prisma');

const simReq = async (
  // eslint-disable-next-line no-unused-vars
  handler: (req: APIRequest, res: APIResponse) => Promise<void>,
  token: 'authorized' | 'unauthorized',
  method: RequestMethod,
  body?: any,
) => {
  const { req, res } = createMocks<APIRequest, APIResponse>({
    method,
    body,
    cookies: {
      token,
    },
  });

  await handler(req, res);
  return res;
};

describe('Testing userinfo/create API route handler', () => {
  const mockReq = (token: 'authorized' | 'unauthorized', method: RequestMethod = 'POST') => simReq(createHandler, token, method, testUser);

  it('creates a userinfo entry no issue', async () => {
    prismaMock.userInfo.create.mockResolvedValue(testUser);
    const res = await mockReq('authorized');

    expect(prismaMock.userInfo.create).toBeCalledWith({
      data: testUser,
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ result: 'success', value: testUser });
  });

  it('should return a 401 if the user is unauthorized', async () => {
    const res = await mockReq('unauthorized');

    expect(prismaMock.userInfo.create).toBeCalledTimes(0);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ result: 'error', value: 'Must be logged in' });
  });

  it('should return a 405 if the HTTP method was unsupported', async () => {
    const res = await mockReq('authorized', 'PUT');

    expect(prismaMock.userInfo.create).toBeCalledTimes(0);
    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({ result: 'error', value: 'Unsupported HTTP method: \'PUT\'' });
  });

  it('should return 500 if the handler errors', async () => {
    prismaMock.userInfo.create.mockRejectedValue(new Error('Error Message'));
    const res = await mockReq('authorized', 'POST');

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toHaveProperty('result', 'error');
    expect(res._getJSONData()).toHaveProperty('value.message', 'Error Message');
  });
});

describe('Testing userinfo/index API route handler', () => {
  const mockReq = (token: 'authorized' | 'unauthorized', method: RequestMethod = 'GET') => simReq(getHandler, token, method);

  it('retrieves only the info of the logged in user', async () => {
    prismaMock.userInfo.findFirst.mockResolvedValue(testUser);
    const res = await mockReq('authorized');

    expect(prismaMock.userInfo.findFirst).toBeCalledWith({
      where: {
        username: testUser.username,
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ result: 'success', value: testUser });
  });
});
