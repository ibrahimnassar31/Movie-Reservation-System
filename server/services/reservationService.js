import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createReservation = async (user_id, showtime_id, seat_id) => {
  try {
    // Check if showtime exists
    const [showtimeRows] = await pool.query(queries.checkShowtime, [showtime_id]);
    if (!showtimeRows.length) {
      throw new Error('Showtime not found');
    }

    // Check if seat exists and belongs to the showtime's theater
    const [seatRows] = await pool.query(queries.checkSeat, [seat_id, showtimeRows[0].theater_id]);
    if (!seatRows.length) {
      throw new Error('Seat not found or not available for this showtime');
    }

    // Check if seat is already reserved
    const [reservationRows] = await pool.query(queries.checkReservation, [showtime_id, seat_id]);
    if (reservationRows.length) {
      throw new Error('Seat is already reserved');
    }

    // Create reservation
    const [result] = await pool.query(queries.createReservation, [user_id, showtime_id, seat_id]);
    const reservationId = result.insertId;

    return { id: reservationId, user_id, showtime_id, seat_id };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserReservations = async (user_id) => {
  try {
    const [rows] = await pool.query(queries.getUserReservations, [user_id]);
    return rows.map((row) => ({
      reservation_id: row.reservation_id,
      showtime_id: row.showtime_id,
      seat_id: row.seat_id,
      seat_number: row.seat_number,
      showtime: row.showtime,
      price: parseFloat(row.price),
      movie_title: row.movie_title,
      theater_name: row.theater_name
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteReservation = async (reservation_id, user_id) => {
  try {
    // Check if reservation exists and belongs to the user
    const [reservationRows] = await pool.query(queries.checkReservationById, [reservation_id, user_id]);
    if (!reservationRows.length) {
      throw new Error('Reservation not found or not authorized');
    }

    // Delete reservation
    await pool.query(queries.deleteReservation, [reservation_id, user_id]);
    return { id: reservation_id };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAvailableSeats = async (showtime_id) => {
  try {
    // Check if showtime exists
    const [showtimeRows] = await pool.query(queries.checkShowtime, [showtime_id]);
    if (!showtimeRows.length) {
      throw new Error('Showtime not found');
    }

    // Get available seats
    const [seatRows] = await pool.query(queries.getAvailableSeats, [showtime_id, showtime_id]);
    return seatRows.map((row) => ({
      seat_id: row.seat_id,
      seat_number: row.seat_number
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};