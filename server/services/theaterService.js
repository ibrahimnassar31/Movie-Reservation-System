import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createTheater = async (name, location) => {
  try {
    // Validate inputs
    if (!name || !location) {
      throw new Error('Name and location are required');
    }

    const [result] = await pool.query(queries.createTheater, [name, location]);
    return { id: result.insertId, name, location };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTheaters = async () => {
  try {
    const [rows] = await pool.query(queries.getTheaters);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      location: row.location
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateTheater = async (theater_id, name, location) => {
  try {
    // Check if theater exists
    const [theaterRows] = await pool.query(queries.checkTheater, [theater_id]);
    if (!theaterRows.length) {
      throw new Error('Theater not found');
    }

    // Validate inputs
    if (!name || !location) {
      throw new Error('Name and location are required');
    }

    await pool.query(queries.updateTheater, [name, location, theater_id]);
    return { id: theater_id, name, location };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteTheater = async (theater_id) => {
  try {
    // Check if theater exists
    const [theaterRows] = await pool.query(queries.checkTheater, [theater_id]);
    if (!theaterRows.length) {
      throw new Error('Theater not found');
    }

    // Check if theater has showtimes
    const [showtimeRows] = await pool.query(queries.checkTheaterShowtimes, [theater_id]);
    if (showtimeRows.length) {
      throw new Error('Cannot delete theater with existing showtimes');
    }

    // Check if theater has seats
    const [seatRows] = await pool.query(queries.checkTheaterSeats, [theater_id]);
    if (seatRows.length) {
      throw new Error('Cannot delete theater with existing seats');
    }

    await pool.query(queries.deleteTheater, [theater_id]);
    return { id: theater_id };
  } catch (error) {
    throw new Error(error.message);
  }
};