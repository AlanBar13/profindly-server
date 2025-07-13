import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { SpecialistModel } from '../models/specialist.model';
import { matchingService, type PatientInfo } from '../services/matching.service';

export const matcher = asyncHandler(async (req: Request, res: Response) => {
    const specialists = await SpecialistModel.find().populate('user').lean();

    const matches = await matchingService.matchSpecialistAI(specialists, req.body as PatientInfo)
    res.status(200).json(matches);
});