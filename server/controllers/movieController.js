import { createMovie, getMovies, updateMovie, deleteMovie } from '../services/movieService.js';

export const createMovieController = async (req, res, next) => {
  try {
    const { title, description, poster_url } = req.body;

    if (!title || !description) {
      throw Object.assign(new Error('Title and description are required'), { statusCode: 400 });
    }

    const movie = await createMovie(title, description, poster_url);
    res.status(201).json({
      status: 'success',
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

export const getMoviesController = async (req, res, next) => {
  try {
    const movies = await getMovies();
    res.json({
      status: 'success',
      data: movies
    });
  } catch (error) {
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
    if (!title || !description) {
      throw Object.assign(new Error('Title and description are required'), { statusCode: 400 });
    }

    const movie = await updateMovie(parseInt(id), title, description, poster_url);
    res.json({
      status: 'success',
      data: movie,
      message: 'Movie updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMovieController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid movie ID is required'), { statusCode: 400 });
    }

    const result = await deleteMovie(parseInt(id));
    res.json({
      status: 'success',
      data: result,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};