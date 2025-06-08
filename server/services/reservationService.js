import pool from '../config/database.js';
import { queries } from '../sql/queries.js';
import { createNotification } from './notificationService.js';

export const createReservation = async (user_id, showtime_id, seat_id, promotion_code) => {
  try {
    // Validate inputs
    if (!user_id || !showtime_id || !seat_id) {
      throw new Error('User ID, showtime ID, and seat ID are required');
    }

    // Check showtime existence
    const [showtimeRows] = await pool.query(queries.checkShowtime, [showtime_id]);
    if (!showtimeRows.length) {
      throw new Error('Showtime not found');
    }
    const showtime = showtimeRows[0];

    // Check seat existence and theater compatibility
    const [seatRows] = await pool.query(queries.checkSeat, [seat_id, showtime.theater_id]);
    if (!seatRows.length) {
      throw new Error('Seat not found or not available in this theater');
    }

    // Check if seat is already reserved
    const [reservationRows] = await pool.query(queries.checkReservation, [showtime_id, seat_id]);
    if (reservationRows.length) {
      throw new Error('Seat is already reserved');
    }

    // Initialize price and promotion
    let final_price = showtime.price;
    let promotion_id = null;

    // Apply promotion if provided
    if (promotion_code) {
      const [promotionRows] = await pool.query(queries.checkPromotionByCode, [promotion_code.trim().toUpperCase()]);
      if (!promotionRows.length) {
        throw new Error('Invalid or expired promotion code');
      }
      const promotion = promotionRows[0];
      const discount = (promotion.discount_percentage / 100) * final_price;
      final_price = parseFloat((final_price - discount).toFixed(2));
      promotion_id = promotion.id;
    }

    // Create reservation
    const [result] = await pool.query(queries.createReservation, [user_id, showtime_id, seat_id, promotion_id, final_price]);

    // Create notification for reservation
    const message = `New reservation created for ${showtime.movie_title} at ${showtime.theater_name} on ${showtime.showtime}`;
    await createNotification(user_id, message, 'reservation');

    return {
      id: result.insertId,
      user_id,
      showtime_id,
      seat_id,
      promotion_id,
      final_price,
      showtime: showtime.showtime,
      movie_title: showtime.movie_title,
      theater_name: showtime.theater_name
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserReservations = async (user_id) => {
  try {
    if (!user_id) {
      throw new Error('User ID is required');
    }

    const [rows] = await pool.query(queries.getUserReservations, [user_id]);
    return rows.map((row) => ({
      reservation_id: row.reservation_id,
      showtime_id: row.showtime_id,
      seat_id: row.seat_id,
      promotion_id: row.promotion_id,
      final_price: parseFloat(row.final_price),
      seat_number: row.seat_number,
      showtime: row.showtime,
      original_price: parseFloat(row.original_price),
      movie_title: row.movie_title,
      theater_name: row.theater_name,
      promotion_code: row.promotion_code
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelReservation = async (reservation_id, user_id) => {
  try {
    if (!reservation_id || !user_id) {
      throw new Error('Reservation ID and user ID are required');
    }

    const [reservationRows] = await pool.query(queries.checkReservationById, [reservation_id, user_id]);
    if (!reservationRows.length) {
      throw new Error('Reservation not found or not authorized');
    }

    await pool.query(queries.deleteReservation, [reservation_id, user_id]);
    return { id: reservation_id };
  } catch (error) {
    throw new Error(error.message);
  }
};