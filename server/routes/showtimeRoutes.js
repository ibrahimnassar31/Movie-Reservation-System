import { Router } from 'express';
import { createShowtimeController, getShowtimesController, updateShowtimeController, deleteShowtimeController } from '../controllers/showtimeController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.get('/showtimes', getShowtimesController);
router.post('/showtimes', verifyToken, restrictToAdmin, createShowtimeController);
router.put('/showtimes/:id', verifyToken, restrictToAdmin, updateShowtimeController);
router.delete('/showtimes/:id', verifyToken, restrictToAdmin, deleteShowtimeController);

export default router;