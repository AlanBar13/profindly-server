import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prisma';
import { matchingService, type PatientInfo } from '../services/matching.service';

export const matcher = asyncHandler(async (req: Request, res: Response) => {
    const specialists = await prisma.specialist.findMany({
        include: { user: true },
    });

    const matches = await matchingService.matchSpecialistAI(specialists as any, req.body as PatientInfo);
    res.status(200).json(matches);
});