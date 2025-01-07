import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PatientModel } from '../models/patient.model';

export const createPatient = asyncHandler(async (req: Request, res: Response) => {
    const patient = new PatientModel(req.body);
    await patient.save();
    res.json(patient);
});