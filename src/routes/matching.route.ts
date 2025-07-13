import express from 'express';
import { matcher } from '../controllers/matching.controller';

const router = express.Router();

router.route('/').post(matcher);

export default router;