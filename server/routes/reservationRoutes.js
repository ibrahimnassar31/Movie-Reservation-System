import { Router } from 'express';
import { createReservationController, getUserReservationsController, cancelReservationController } from '../controllers/reservationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/reservations', verifyToken, createReservationController);
router.get('/reservations', verifyToken, getUserReservationsController);
router.delete('/reservations/:id', verifyToken, cancelReservationController);

export default router;