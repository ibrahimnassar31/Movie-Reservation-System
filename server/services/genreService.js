import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createGenre = async (name) => {
  try {
    // Check if genre already exists
    const [existingGenres] = await pool.query('SELECT * FROM Genres WHERE name = ?', [name]);
    if (existingGenres.length) {
      throw new Error('Genre already exists');
    }

    const [result] = await pool.query(queries.createGenre, [name]);
    return { id: result.insertId, name };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getGenres = async () => {
  try {
    const [rows] = await pool.query(queries.getGenres);
    return rows.map((row) => ({
      id: row.id,
      name: row.name
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateGenre = async (genre_id, name) => {
  try {
    // Check if genre exists
    const [genreRows] = await pool.query(queries.checkGenre, [genre_id]);
    if (!genreRows.length) {
      throw new Error('Genre not found');
    }

    // Check if new name is already taken
    const [existingGenres] = await pool.query('SELECT * FROM Genres WHERE name = ? AND id != ?', [name, genre_id]);
    if (existingGenres.length) {
      throw new Error('Genre name already exists');
    }

    await pool.query(queries.updateGenre, [name, genre_id]);
    return { id: genre_id, name };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteGenre = async (genre_id) => {
  try {
    // Check if genre exists
    const [genreRows] = await pool.query(queries.checkGenre, [genre_id]);
    if (!genreRows.length) {
      throw new Error('Genre not found');
    }

    // Check if genre is associated with movies
    const [movieGenreRows] = await pool.query(queries.checkGenreMovies, [genre_id]);
    if (movieGenreRows.length) {
      throw new Error('Cannot delete genre associated with movies');
    }

    await pool.query(queries.deleteGenre, [genre_id]);
    return { id: genre_id };
  } catch (error) {
    throw new Error(error.message);
  }
};