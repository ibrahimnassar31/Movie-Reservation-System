import { Router } from 'express';
import { getReservationStatsController } from '../controllers/reportController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.get('/reports', verifyToken, restrictToAdmin, getReservationStatsController);

export default router;