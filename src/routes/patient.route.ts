import express from 'express';
import { validateData } from '../middleware/validation.middleware';
import { patientSchema, updatedPatientSchema } from '../schema/patient.schema';
import { createPatient, getPatients, getPatient, updatePatient, deletePatient } from '../controllers/patient.controller';

const router = express.Router();

router.route('/').get(getPatients).post(validateData(patientSchema), createPatient);
router.route('/:id').get(getPatient).patch(validateData(updatedPatientSchema), updatePatient).delete(deletePatient);

export default router;