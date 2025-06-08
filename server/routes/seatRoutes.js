import { Router } from 'express';
import { createSeatController, getSeatsByTheaterController, updateSeatController, deleteSeatController } from '../controllers/seatController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.get('/theaters/:theater_id/seats', getSeatsByTheaterController);
router.post('/theaters/:theater_id/seats', verifyToken, restrictToAdmin, createSeatController);
router.put('/seats/:id', verifyToken, restrictToAdmin, updateSeatController);
router.delete('/seats/:id', verifyToken, restrictToAdmin, deleteSeatController);

export default router;