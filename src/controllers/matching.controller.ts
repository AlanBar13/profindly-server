import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { SpecialistModel } from '../models/specialist.model';
import { PatientModel } from '../models/patient.model';
import { calculatePoints, matchSpecialist } from '../services/matching.service';

export const matcher = asyncHandler(async (req: Request, res: Response) => {
    const patient = await PatientModel.findById(req.params.id);
    if (patient) {
        const specialists = await SpecialistModel.find();
        const matches = matchSpecialist(patient, specialists);
        res.json(matches);
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});