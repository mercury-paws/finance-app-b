import { Router } from 'express';
import waterRouter from './water-router.js';
import authRouter from './auth-router.js';
import inRouter from './in-router.js';

const router = Router();
// router.use('/water-app/auth', authRouter);
// router.use('/water-app/water', waterRouter);

router.use('/auth', authRouter);
router.use('/water', waterRouter);
router.use('/in', inRouter);

export default router;
