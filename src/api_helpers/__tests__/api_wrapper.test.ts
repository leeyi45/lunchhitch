/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "expectApiResult"] } ] */
import { createMocks, RequestMethod } from 'node-mocks-http';

import testUser from '../../auth/test_user';
import type { APIRequest, APIResponse } from '../../testing/api_mocker';
import { prismaMock } from '../../testing/singleton';
import {
  prismaHandler, UNAUTHORIZED_MSG, wrapWithAuth, wrapWithQuery,
} from '../api_wrappers';
import type { APIResult, Handler } from '../types';

jest.mock('../../firebase/admin');

const mockReq = (method: RequestMethod = 'POST') => createMocks<APIRequest, APIResponse>({
  method,
  body: testUser,
});

const mockAuthReq = (token: 'authorized' | 'unauthorized', method: RequestMethod = 'POST') => {
  const { req, res } = mockReq(method);
  req.cookies = {
    token,
  };

  return { req, res };
};

const expectApiResult = <T>(statusCode: number,
  expected: APIResult<T>) => (res: APIResponse) => {
    expect(res.statusCode).toBe(statusCode);
    expect(res._getJSONData()).toEqual(expected);
  };

describe('Test wrapWithQuery', () => {
  describe('Test Handler with a single POST handler', () => {
    const handler: Handler<any, any> = async () => ({ result: 'success', value: 'test worked!' });

    const wrapped = wrapWithQuery<any, any>({
      handlers: {
        POST: handler,
      },
    });

    test('Regular POST call', async () => {
      const { req, res } = mockReq();

      await wrapped(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ result: 'success', value: 'test worked!' });
    });

    test('Regular GET call', async () => {
      const { req, res } = mockReq('GET');

      await wrapped(req, res);
      expect(res.statusCode).toBe(405);
      expect(res._getJSONData()).toEqual({ result: 'error', value: 'Unsupported HTTP method: \'GET\'' });
    });
  });

  describe('Test handler with multiple methods', () => {
    const testData = { result: 'success', value: 'test worked!' } as APIResult<string>;
    const handler: Handler<any, any> = async () => testData;

    const wrapped = wrapWithQuery<any, any>({
      handlers: {
        PUT: handler,
        POST: handler,
      },
    });

    test('Regular POST call', async () => {
      const { req, res } = mockReq();

      await wrapped(req, res);
      expectApiResult(200, testData)(res);
    });

    test('Regular PUT call', async () => {
      const { req, res } = mockReq('PUT');

      await wrapped(req, res);
      expectApiResult(200, testData)(res);
    });

    test('Regular GET call', async () => {
      const { req, res } = mockReq('GET');

      await wrapped(req, res);
      expectApiResult(405, { result: 'error', value: 'Unsupported HTTP method: \'GET\'' });
    });
  });

  describe('Test handler with query params', () => {
    describe('Test a handler with only 1 query param', () => {
      const handler: Handler<any, any> = async ({ params: { value } }) => ({ result: 'success', value });

      const wrapped = wrapWithQuery<any, any>({
        params: ['value'],
        handlers: {
          POST: handler,
        },
      });

      test('Regular POST call with query value', async () => {
        const { req, res } = createMocks<APIRequest, APIResponse>({
          method: 'POST',
          url: '/test_api?value=hello',
        });
        await wrapped(req, res);
        expectApiResult(200, { result: 'success', value: 'hello' })(res);
      });

      test('Regular POST call without query value', async () => {
        const { req, res } = createMocks<APIRequest, APIResponse>({
          method: 'POST',
          url: '/test_api',
        });

        await wrapped(req, res);
        expectApiResult(400, { result: 'error', value: 'Missing required query params: value' })(res);
      });
    });
  });

  describe('Test a handler with multiple query params', () => {
    const handler: Handler<any, any> = async ({ params }) => ({ result: 'success', value: params });

    const wrapped = wrapWithQuery<any, any>({
      params: ['value0', 'value1'],
      handlers: {
        POST: handler,
      },
    });

    test('Regular POST call with query value', async () => {
      const { req, res } = createMocks<APIRequest, APIResponse>({
        method: 'POST',
        url: '/test_api?value0=hello&value1=there',
      });
      await wrapped(req, res);
      expectApiResult(200, {
        result: 'success',
        value: {
          value0: 'hello',
          value1: 'there',
        },
      })(res);
    });

    test('Regular POST call without query values', async () => {
      const { req, res } = createMocks<APIRequest, APIResponse>({
        method: 'POST',
        url: '/test_api',
      });

      await wrapped(req, res);
      expectApiResult(400, { result: 'error', value: 'Missing required query params: value0, value1' })(res);
    });
  });

  test('an errored handler', async () => {
    const handler: Handler<any, any> = async () => { throw new Error('Test Error Message'); };

    const wrapped = wrapWithQuery<any, any>({
      handlers: {
        POST: handler,
      },
    });

    const { req, res } = createMocks<APIRequest, APIResponse>({
      method: 'POST',
      url: '/test_api',
    });
    await wrapped(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toHaveProperty('value.message', 'Test Error Message');
  });
});

describe('Test wrapWithAuth', () => {
  describe('Test Handler with a single POST handler', () => {
    const handler: Handler<any, any> = async ({ params: { username } }) => ({ result: 'success', value: ['hello', username] });

    const wrapped = wrapWithAuth<any, any>({
      handlers: {
        POST: handler,
      },
    });

    test('Regular authorized POST call', async () => {
      const { req, res } = mockAuthReq('authorized');

      await wrapped(req, res);
      expectApiResult(200, { result: 'success', value: ['hello', testUser.username] })(res);
    });

    test('Regular authorized GET call', async () => {
      const { req, res } = mockAuthReq('authorized', 'GET');

      await wrapped(req, res);
      expectApiResult(405, { result: 'error', value: 'Unsupported HTTP method: \'GET\'' });
    });

    test('Unauthorized POST call', async () => {
      const { req, res } = mockAuthReq('unauthorized', 'POST');
      await wrapped(req, res);
      expectApiResult(401, { result: 'error', value: UNAUTHORIZED_MSG });
    });
  });
});

describe('Test prismaHandler', () => {
  const handler = prismaHandler(() => prismaMock.userInfo.findFirst({}));

  it('should return an error if prisma returns nothing', async () => {
    const { req, res } = createMocks<APIRequest, APIResponse>();
    prismaMock.userInfo.findFirst.mockResolvedValue(null);

    const result = await handler({
      data: {},
      req,
      res,
      params: {},
    });

    expect(result).toEqual({ result: 'error', value: 'No document matched the given criteria!' });
  });
});
