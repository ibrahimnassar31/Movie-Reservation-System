import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const getReservationStats = async (start_date = null, end_date = null) => {
  try {
    // Validate dates
    if (start_date && isNaN(Date.parse(start_date))) {
      throw new Error('Invalid start date format');
    }
    if (end_date && isNaN(Date.parse(end_date))) {
      throw new Error('Invalid end date format');
    }

    const [rows] = await pool.query(queries.getReservationStats, [start_date, start_date, end_date, end_date]);

    if (!rows.length) {
      return {
        total_reservations: 0,
        total_revenue: 0,
        movies: []
      };
    }

    const totalReservations = rows[0].total_reservations || 0;
    const totalRevenue = parseFloat(rows[0].total_revenue) || 0;

    const movies = rows.map(row => ({
      movie_id: row.movie_id,
      movie_title: row.movie_title,
      reservation_count: row.reservation_count
    }));

    return {
      total_reservations: totalReservations,
      total_revenue: totalRevenue.toFixed(2),
      movies
    };
  } catch (error) {
    throw new Error(`Failed to fetch reservation stats: ${error.message}`);
  }
};