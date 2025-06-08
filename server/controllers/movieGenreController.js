import { addMovieGenre, getMovieGenres, deleteMovieGenre } from '../services/movieGenreService.js';
import logger from '../utils/logger.js';

export const addMovieGenreController = async (req, res, next) => {
  try {
    const { id } = req.params; // movie_id
    const { genre_id } = req.body;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid movie ID is required'), { statusCode: 400 });
    }
    if (!genre_id || isNaN(genre_id)) {
      throw Object.assign(new Error('Valid genre ID is required'), { statusCode: 400 });
    }

    const result = await addMovieGenre(parseInt(id), parseInt(genre_id));
    
    logger.info('Genre added to movie successfully', {
      movieId: id,
      genreId: genre_id,
      userId: req.user ? req.user.id : null
    });

    res.status(201).json({
      status: 'success',
      data: result,
      message: 'Genre added to movie successfully'
    });
  } catch (error) {
    logger.error('Failed to add genre to movie', {
      error: error.message,
      movieId: req.params.id,
      genreId: req.body.genre_id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const getMovieGenresController = async (req, res, next) => {
  try {
    const { id } = req.params; // movie_id

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid movie ID is required'), { statusCode: 400 });
    }

    const genres = await getMovieGenres(parseInt(id));
    
    logger.info('Movie genres retrieved', {
      movieId: id,
      count: genres.length
    });

    res.json({
      status: 'success',
      data: genres
    });
  } catch (error) {
    logger.error('Failed to retrieve movie genres', {
      error: error.message,
      movieId: req.params.id
    });
    next(error);
  }
};

export const deleteMovieGenreController = async (req, res, next) => {
  try {
    const { id, genre_id } = req.params; // id is movie_id

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid movie ID is required'), { statusCode: 400 });
    }
    if (!genre_id || isNaN(genre_id)) {
      throw Object.assign(new Error('Valid genre ID is required'), { statusCode: 400 });
    }

    const result = await deleteMovieGenre(parseInt(id), parseInt(genre_id));
    
    logger.info('Genre removed from movie successfully', {
      movieId: id,
      genreId: genre_id,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Genre removed from movie successfully'
    });
  } catch (error) {
    logger.error('Failed to remove genre from movie', {
      error: error.message,
      movieId: req.params.id,
      genreId: req.params.genre_id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};