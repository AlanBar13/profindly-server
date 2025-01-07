import express from 'express';
import { validateData } from '../middleware/validation.middleware';
import { patientSchema } from '../schema/patient.schema';
import { createPatient } from '../controllers/patient.controller';

const router = express.Router();

router.post('/create', validateData(patientSchema), createPatient);

export default router;