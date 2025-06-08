import { createMovie, getMovies, updateMovie, deleteMovie } from '../services/movieService.js';
import logger from '../utils/logger.js';

export const createMovieController = async (req, res, next) => {
  try {
    const { title, description, poster_url } = req.body;

    if (!title || !description || !poster_url) {
      throw Object.assign(new Error('Title, description, and poster URL are required'), { statusCode: 400 });
    }

    const movieData = await createMovie(title, description, poster_url);

    logger.info('Movie created successfully', {
      movieId: movieData.id,
      title,
      adminId: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: movieData
    });
  } catch (error) {
    logger.error('Failed to create movie', {
      error: error.message,
      title: req.body.title,
      adminId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const getMoviesController = async (req, res, next) => {
  try {
    const { search } = req.query;
    const movies = await getMovies(search);

    logger.info('Movies retrieved successfully', {
      count: movies.length,
      searchQuery: search || 'none'
    });

    res.json({
      status: 'success',
      data: movies
    });
  } catch (error) {
    logger.error('Failed to retrieve movies', {
      error: error.message,
      searchQuery: req.query.search || 'none'
    });
    next(error);
  }
};

export const updateMovieController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, poster_url } = req.body;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid movie ID is required'), { statusCode: 400 });
    }
    if (!title || !description || !poster_url) {
      throw Object.assign(new Error('Title, description, and poster URL are required'), { statusCode: 400 });
    }

    const movieData = await updateMovie(id, title, description, poster_url);

    logger.info('Movie updated successfully', {
      movieId: id,
      title,
      adminId: req.user.id
    });

    res.json({
      status: 'success',
      data: movieData
    });
  } catch (error) {
    logger.error('Failed to update movie', {
      error: error.message,
      movieId: req.params.id,
      adminId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const deleteMovieController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid movie ID is required'), { statusCode: 400 });
    }

    const result = await deleteMovie(id);

    logger.info('Movie deleted successfully', {
      movieId: id,
      adminId: req.user.id
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete movie', {
      error: error.message,
      movieId: req.params.id,
      adminId: req.user ? req.user.id : null
    });
    next(error);
  }
};