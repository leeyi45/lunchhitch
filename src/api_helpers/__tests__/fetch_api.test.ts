/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "expectFetch"] } ] */
import fetch from 'jest-mock-fetch';

import {
  APIResult, asApiError, asApiSuccess, fetchApi, fetchApiThrowOnError,
} from '..';

afterEach(() => fetch.reset());

const testFetch = <T>(mockResp: APIResult<T>, body?: any) => {
  const fetchTask = fetchApi('test_api', body);
  fetch.mockResponse({
    json: () => mockResp,
  });

  return fetchTask;
};

describe('Test fetchApi', () => {
  const expectFetch = async <T>(mockResp: APIResult<T>, body?: any) => {
    const result = await testFetch(mockResp, body);
    expect(fetch).toBeCalledWith('http://localhost/api/test_api', {
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: body !== undefined ? 'POST' : 'GET',
    });
    expect(fetch).toBeCalledTimes(1);
    expect(result).toEqual(mockResp);
  };
  test('Passing no data should make it a GET request', async () => {
    await expectFetch(asApiSuccess('what'));
  });

  test('Passing data should make it a POST request', async () => {
    await expectFetch(asApiSuccess('what'), { test: 'test' });
  });
});

describe('Testing fetchApiThrowOnError', () => {
  it('Should return the value of the API result', async () => {
    const fetchTask = fetchApiThrowOnError('test_api');
    fetch.mockResponse({
      json: () => asApiSuccess('Test Success'),
    });

    expect(fetch).toBeCalledTimes(1);
    await expect(fetchTask).resolves.toBe('Test Success');
  });

  it('Should throw when the returned API result is errored', async () => {
    const fetchTask = fetchApiThrowOnError('test_api');
    fetch.mockResponse({
      json: () => asApiError('Test Error'),
    });

    expect(fetch).toBeCalledTimes(1);
    await expect(fetchTask).rejects.toBe('Test Error');
  });
});
