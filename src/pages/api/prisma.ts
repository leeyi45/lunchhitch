import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../prisma';

type PrismaType = {
    [key: string]: any;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, collection } = req.query;

    if (typeof method !== 'string') {
        res.status(400).json({ error: 'method must be provided!'})
        return;
    }

    if (typeof collection !== 'string') {
        res.status(400).json({ error: 'collection must be provided!'})
        return;
    }

    try {
        const result = await (prisma as PrismaType)[collection][method](req.body);
        res.status(200).json(result);
    } catch(error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
