import { createReservation, getUserReservations, cancelReservation } from '../services/reservationService.js';
import logger from '../utils/logger.js';

export const createReservationController = async (req, res, next) => {
  try {
    const { showtime_id, seat_id, promotion_code } = req.body;
    const user_id = req.user.id;

    if (!showtime_id || !seat_id) {
      throw Object.assign(new Error('Showtime ID and seat ID are required'), { statusCode: 400 });
    }

    const reservationData = await createReservation(user_id, showtime_id, seat_id, promotion_code);
    
    logger.info('Reservation created successfully', {
      reservationId: reservationData.id,
      userId: user_id,
      showtimeId: showtime_id,
      seatId: seat_id,
      promotionCode: promotion_code || null,
      finalPrice: reservationData.final_price
    });

    res.status(201).json({
      status: 'success',
      data: reservationData
    });
  } catch (error) {
    logger.error('Failed to create reservation', {
      error: error.message,
      userId: req.user ? req.user.id : null,
      showtimeId: req.body.showtime_id,
      seatId: req.body.seat_id,
      promotionCode: req.body.promotion_code || null
    });
    next(error);
  }
};

export const getUserReservationsController = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const reservations = await getUserReservations(user_id);
    
    logger.info('User reservations retrieved', {
      userId: user_id,
      count: reservations.length
    });

    res.json({
      status: 'success',
      data: reservations
    });
  } catch (error) {
    logger.error('Failed to retrieve user reservations', {
      error: error.message,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const cancelReservationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid reservation ID is required'), { statusCode: 400 });
    }

    const result = await cancelReservation(id, user_id);
    
    logger.info('Reservation cancelled successfully', {
      reservationId: id,
      userId: user_id
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    logger.error('Failed to cancel reservation', {
      error: error.message,
      reservationId: req.params.id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};