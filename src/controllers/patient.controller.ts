import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PatientModel } from '../models/patient.model';

export const createPatient = asyncHandler(async (req: Request, res: Response) => {
    const patient = new PatientModel(req.body);
    await patient.save();
    res.json(patient);
});

export const getPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await PatientModel.find();
    res.json(patients);
});

export const getPatient = asyncHandler(async (req: Request, res: Response) => {
    const patient = await PatientModel.findById(req.params.id);
    if (patient) {
        res.json(patient);
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});

export const updatePatient = asyncHandler(async (req: Request, res: Response) => {
    const patient = await PatientModel.findById(req.params.id);
    if (patient) {
        patient.name = req.body.name || patient.name;
        patient.age = req.body.age || patient.age;
        patient.email = req.body.email || patient.email;
        patient.syntoms = req.body.syntoms || patient.syntoms;
        patient.diagnostic = req.body.diagnostic || patient.diagnostic;
        patient.treatment = req.body.treatment || patient.treatment;
        patient.budget = req.body.budget || patient.budget;
        patient.location = req.body.location || patient.location;
        patient.langauges = req.body.langauges || patient.langauges;

        const updatedPatient = await patient.save();
        res.json(updatedPatient);
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});

export const deletePatient = asyncHandler(async (req: Request, res: Response) => {
    const patient = await PatientModel.deleteOne({ _id: req.params.id });
    if (patient.deletedCount > 0) {
        res.json({ message: 'Patient removed' });
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});