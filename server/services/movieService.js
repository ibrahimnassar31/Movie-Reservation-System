import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createMovie = async (title, description, poster_url) => {
  try {
    if (!title || !description || !poster_url) {
      throw new Error('Title, description, and poster URL are required');
    }

    const [result] = await pool.query(queries.createMovie, [title.trim(), description.trim(), poster_url.trim()]);
    return { id: result.insertId, title, description, poster_url };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMovies = async (search = '', genre = null) => {
  try {
    let rows;
    if (search || genre) {
      const searchTerm = search ? `%${search.trim()}%` : null;
      const genreTerm = genre ? genre.trim() : null;
      [rows] = await pool.query(queries.searchMovies, [searchTerm, searchTerm, searchTerm, genreTerm, genreTerm]);
    } else {
      [rows] = await pool.query(queries.getMovies);
    }

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      poster_url: row.poster_url,
      genres: row.genres ? row.genres.split(',') : []
    }));
  } catch (error) {
    throw new Error(`Failed to fetch movies: ${error.message}`);
  }
};

export const updateMovie = async (id, title, description, poster_url) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('Valid movie ID is required');
    }
    if (!title || !description || !poster_url) {
      throw new Error('Title, description, and poster URL are required');
    }

    const [movieRows] = await pool.query(queries.checkMovie, [id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    await pool.query(queries.updateMovie, [title.trim(), description.trim(), poster_url.trim(), id]);
    return { id, title, description, poster_url };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMovie = async (id) => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('Valid movie ID is required');
    }

    const [movieRows] = await pool.query(queries.checkMovie, [id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    const [showtimeRows] = await pool.query(queries.checkMovieShowtimes, [id]);
    if (showtimeRows.length) {
      throw new Error('Cannot delete movie with active showtimes');
    }

    await pool.query(queries.deleteMovie, [id]);
    return { id };
  } catch (error) {
    throw new Error(error.message);
  }
};