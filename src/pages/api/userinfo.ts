import { wrapWithAuth } from '../../api_wrappers';
import prisma from '../../prisma';

export default wrapWithAuth(['method'], (req, res, { method }) => (prisma.userInfo as any)[method](req.body));