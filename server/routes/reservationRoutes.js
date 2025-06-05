import { Router } from 'express';
import { createReservationController, getUserReservationsController, deleteReservationController, getAvailableSeatsController } from '../controllers/reservationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/reservations', verifyToken, createReservationController);
router.get('/reservations', verifyToken, getUserReservationsController);
router.delete('/reservations/:id', verifyToken, deleteReservationController);
router.get('/showtimes/:id/seats', getAvailableSeatsController);

export default router;