import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createShowtime = async (movie_id, theater_id, showtime, price) => {
  try {
    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    // Check if theater exists
    const [theaterRows] = await pool.query(queries.checkTheater, [theater_id]);
    if (!theaterRows.length) {
      throw new Error('Theater not found');
    }

    // Validate showtime (must be future date)
    const showtimeDate = new Date(showtime);
    if (showtimeDate <= new Date()) {
      throw new Error('Showtime must be in the future');
    }

    // Validate price
    if (price <= 0) {
      throw new Error('Price must be greater than zero');
    }

    const [result] = await pool.query(queries.createShowtime, [movie_id, theater_id, showtime, price]);
    return { id: result.insertId, movie_id, theater_id, showtime, price };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getShowtimes = async () => {
  try {
    const [rows] = await pool.query(queries.getShowtimes);
    return rows.map((row) => ({
      id: row.id,
      movie_id: row.movie_id,
      theater_id: row.theater_id,
      showtime: row.showtime,
      price: parseFloat(row.price),
      movie_title: row.movie_title,
      theater_name: row.theater_name
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateShowtime = async (showtime_id, movie_id, theater_id, showtime, price) => {
  try {
    // Check if showtime exists
    const [showtimeRows] = await pool.query(queries.checkShowtime, [showtime_id]);
    if (!showtimeRows.length) {
      throw new Error('Showtime not found');
    }

    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    // Check if theater exists
    const [theaterRows] = await pool.query(queries.checkTheater, [theater_id]);
    if (!theaterRows.length) {
      throw new Error('Theater not found');
    }

    // Validate showtime (must be future date)
    const showtimeDate = new Date(showtime);
    if (showtimeDate <= new Date()) {
      throw new Error('Showtime must be in the future');
    }

    // Validate price
    if (price <= 0) {
      throw new Error('Price must be greater than zero');
    }

    await pool.query(queries.updateShowtime, [movie_id, theater_id, showtime, price, showtime_id]);
    return { id: showtime_id, movie_id, theater_id, showtime, price };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteShowtime = async (showtime_id) => {
  try {
    // Check if showtime exists
    const [showtimeRows] = await pool.query(queries.checkShowtime, [showtime_id]);
    if (!showtimeRows.length) {
      throw new Error('Showtime not found');
    }

    // Check if showtime has reservations
    const [reservationRows] = await pool.query(queries.checkShowtimeReservations, [showtime_id]);
    if (reservationRows.length) {
      throw new Error('Cannot delete showtime with existing reservations');
    }

    await pool.query(queries.deleteShowtime, [showtime_id]);
    return { id: showtime_id };
  } catch (error) {
    throw new Error(error.message);
  }
};