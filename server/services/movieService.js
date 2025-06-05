import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createMovie = async (title, description, poster_url) => {
  try {
    const [result] = await pool.query(queries.createMovie, [title, description, poster_url]);
    return { id: result.insertId, title, description, poster_url };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMovies = async () => {
  try {
    const [rows] = await pool.query(queries.getMovies);
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      poster_url: row.poster_url,
      genres: row.genres ? row.genres.split(',') : []
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateMovie = async (movie_id, title, description, poster_url) => {
  try {
    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    // Ensure poster_url is null if undefined
    const finalPosterUrl = poster_url ?? null;

    // Update movie
    await pool.query(queries.updateMovie, [title, description, finalPosterUrl, movie_id]);
    return { id: movie_id, title, description, poster_url: finalPosterUrl };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMovie = async (movie_id) => {
  try {
    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    // Check if movie has associated showtimes
    const [showtimeRows] = await pool.query(queries.checkMovieShowtimes, [movie_id]);
    if (showtimeRows.length) {
      throw new Error('Cannot delete movie with associated showtimes');
    }

    // Delete movie
    await pool.query(queries.deleteMovie, [movie_id]);
    return { id: movie_id };
  } catch (error) {
    throw new Error(error.message);
  }
};