/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-unused-vars
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

export default prisma;

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
