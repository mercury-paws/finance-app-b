import { Router } from 'express';
import waterRouter from './water-router.js';
import authRouter from './auth-router.js';

const router = Router();
router.use('/water-app/auth', authRouter);
router.use('/water-app/water', waterRouter);

export default router;
