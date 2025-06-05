import { createReservation, getUserReservations, deleteReservation, getAvailableSeats } from '../services/reservationService.js';

export const createReservationController = async (req, res, next) => {
  try {
    const { showtime_id, seat_id } = req.body;
    const user_id = req.user.id; // From JWT

    if (!showtime_id || !seat_id) {
      throw Object.assign(new Error('Showtime ID and seat ID are required'), { statusCode: 400 });
    }

    const reservation = await createReservation(user_id, showtime_id, seat_id);
    res.status(201).json({
      status: 'success',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

export const getUserReservationsController = async (req, res, next) => {
  try {
    const user_id = req.user.id; // From JWT
    const reservations = await getUserReservations(user_id);
    res.json({
      status: 'success',
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReservationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id; // From JWT

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid reservation ID is required'), { statusCode: 400 });
    }

    const result = await deleteReservation(parseInt(id), user_id);
    res.json({
      status: 'success',
      data: result,
      message: 'Reservation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSeatsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid showtime ID is required'), { statusCode: 400 });
    }

    const seats = await getAvailableSeats(parseInt(id));
    res.json({
      status: 'success',
      data: seats
    });
  } catch (error) {
    next(error);
  }
};