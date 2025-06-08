import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createSeat = async (theater_id, seat_number) => {
  try {
    // Check if theater exists
    const [theaterRows] = await pool.query(queries.checkTheater, [theater_id]);
    if (!theaterRows.length) {
      throw new Error('Theater not found');
    }

    // Validate seat_number
    if (!seat_number || typeof seat_number !== 'string' || seat_number.trim() === '') {
      throw new Error('Valid seat number is required');
    }

    // Check if seat_number already exists in the theater
    const [existingSeats] = await pool.query('SELECT * FROM Seats WHERE theater_id = ? AND seat_number = ?', [theater_id, seat_number]);
    if (existingSeats.length) {
      throw new Error('Seat number already exists in this theater');
    }

    const [result] = await pool.query(queries.createSeat, [theater_id, seat_number]);
    return { id: result.insertId, theater_id, seat_number };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getSeatsByTheater = async (theater_id) => {
  try {
    // Check if theater exists
    const [theaterRows] = await pool.query(queries.checkTheater, [theater_id]);
    if (!theaterRows.length) {
      throw new Error('Theater not found');
    }

    const [rows] = await pool.query(queries.getSeatsByTheater, [theater_id]);
    return rows.map((row) => ({
      id: row.id,
      theater_id: row.theater_id,
      seat_number: row.seat_number
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateSeat = async (seat_id, seat_number) => {
  try {
    // Check if seat exists
    const [seatRows] = await pool.query(queries.checkSeatById, [seat_id]);
    if (!seatRows.length) {
      throw new Error('Seat not found');
    }

    // Validate seat_number
    if (!seat_number || typeof seat_number !== 'string' || seat_number.trim() === '') {
      throw new Error('Valid seat number is required');
    }

    // Check if new seat_number already exists in the same theater
    const theater_id = seatRows[0].theater_id;
    const [existingSeats] = await pool.query('SELECT * FROM Seats WHERE theater_id = ? AND seat_number = ? AND id != ?', [theater_id, seat_number, seat_id]);
    if (existingSeats.length) {
      throw new Error('Seat number already exists in this theater');
    }

    await pool.query(queries.updateSeat, [seat_number, seat_id]);
    return { id: seat_id, theater_id, seat_number };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteSeat = async (seat_id) => {
  try {
    // Check if seat exists
    const [seatRows] = await pool.query(queries.checkSeatById, [seat_id]);
    if (!seatRows.length) {
      throw new Error('Seat not found');
    }

    // Check if seat has reservations
    const [reservationRows] = await pool.query(queries.checkSeatReservations, [seat_id]);
    if (reservationRows.length) {
      throw new Error('Cannot delete seat with existing reservations');
    }

    await pool.query(queries.deleteSeat, [seat_id]);
    return { id: seat_id };
  } catch (error) {
    throw new Error(error.message);
  }
};