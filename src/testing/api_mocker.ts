import type { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";

export type APIRequest = NextApiRequest & ReturnType<typeof createRequest>;
export type APIResponse = NextApiResponse & ReturnType<typeof createResponse>;

export type MockedFetchResponse = {
  req: APIRequest;
  res: APIResponse;
}