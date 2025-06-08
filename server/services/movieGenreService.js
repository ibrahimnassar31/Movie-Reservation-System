import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const addMovieGenre = async (movie_id, genre_id) => {
  try {
    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    // Check if genre exists
    const [genreRows] = await pool.query(queries.checkGenre, [genre_id]);
    if (!genreRows.length) {
      throw new Error('Genre not found');
    }

    // Check if the movie-genre relation already exists
    const [existingRows] = await pool.query(queries.checkMovieGenre, [movie_id, genre_id]);
    if (existingRows.length) {
      throw new Error('Genre already associated with this movie');
    }

    await pool.query(queries.addMovieGenre, [movie_id, genre_id]);
    return { movie_id, genre_id };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMovieGenres = async (movie_id) => {
  try {
    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    const [rows] = await pool.query(queries.getMovieGenres, [movie_id]);
    return rows.map((row) => ({
      id: row.id,
      name: row.name
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMovieGenre = async (movie_id, genre_id) => {
  try {
    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    // Check if genre exists
    const [genreRows] = await pool.query(queries.checkGenre, [genre_id]);
    if (!genreRows.length) {
      throw new Error('Genre not found');
    }

    // Check if the movie-genre relation exists
    const [existingRows] = await pool.query(queries.checkMovieGenre, [movie_id, genre_id]);
    if (!existingRows.length) {
      throw new Error('Genre not associated with this movie');
    }

    await pool.query(queries.deleteMovieGenre, [movie_id, genre_id]);
    return { movie_id, genre_id };
  } catch (error) {
    throw new Error(error.message);
  }
};