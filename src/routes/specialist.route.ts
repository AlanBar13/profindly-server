import express from 'express';
import { validateData } from '../middleware/validation.middleware';

import { specialistSchema, updatedSpecialistSchema } from '../schema/specialist.schema';
import { createSpecialist, getSpecialists, getSpecialist, updateSpecialist, deleteSpecialist, autoComplete } from '../controllers/specialist.controller';

const router = express.Router();

router.route('/').get(getSpecialists).post(validateData(specialistSchema), createSpecialist);
router.route('/autocomplete').get(autoComplete);
router.route('/:id').get(getSpecialist).patch(validateData(updatedSpecialistSchema), updateSpecialist).delete(deleteSpecialist);

export default router;