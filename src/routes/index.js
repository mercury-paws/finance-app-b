import { Router } from 'express';
import contactsRouter from './contacts-router.js';
import authRouter from './auth-router.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/contacts', contactsRouter);

export default router;
