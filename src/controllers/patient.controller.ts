import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prisma';

export const createPatient = asyncHandler(async (req: Request, res: Response) => {
    const patient = await prisma.patient.create({
        data: {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            syntoms: req.body.syntoms || [],
            diagnostic: req.body.diagnostic,
            treatment: req.body.treatment,
            budget: req.body.budget || [],
            location: req.body.location,
            languages: req.body.languages || [],
            userId: req.body.userId, // userId is required in Prisma schema
        },
    });
    res.status(201).json(patient);
});

export const getPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await prisma.patient.findMany();
    res.json(patients);
});

export const getPatient = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (patient) {
        res.json(patient);
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});

export const updatePatient = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const updatedPatient = await prisma.patient.update({
            where: { id },
            data: {
                name: req.body.name,
                age: req.body.age,
                email: req.body.email,
                syntoms: req.body.syntoms,
                diagnostic: req.body.diagnostic,
                treatment: req.body.treatment,
                budget: req.body.budget,
                location: req.body.location,
                languages: req.body.languages,
                userId: req.body.userId,
            },
        });
        res.json(updatedPatient);
    } catch (error) {
        res.status(404);
        throw new Error('Patient not found');
    }
});

export const deletePatient = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.patient.delete({ where: { id } });
        res.json({ message: 'Patient removed' });
    } catch (error) {
        res.status(404);
        throw new Error('Patient not found');
    }
});