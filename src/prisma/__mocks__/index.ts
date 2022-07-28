import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => mockReset(prismaMock));

export default prismaMock as DeepMockProxy<PrismaClient>;
