import express from 'express';
import { matcher } from '../controllers/matching.controller';

const router = express.Router();

router.route('/:id').get(matcher);

export default router;