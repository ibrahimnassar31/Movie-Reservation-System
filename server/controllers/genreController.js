import { createGenre, getGenres, updateGenre, deleteGenre } from '../services/genreService.js';
import logger from '../utils/logger.js';

export const createGenreController = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw Object.assign(new Error('Genre name is required'), { statusCode: 400 });
    }

    const genre = await createGenre(name);
    
    logger.info('Genre created successfully', {
      genreId: genre.id,
      name,
      userId: req.user ? req.user.id : null
    });

    res.status(201).json({
      status: 'success',
      data: genre
    });
  } catch (error) {
    logger.error('Failed to create genre', {
      error: error.message,
      name: req.body.name,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const getGenresController = async (req, res, next) => {
  try {
    const genres = await getGenres();
    
    logger.info('Genres retrieved', { count: genres.length });

    res.json({
      status: 'success',
      data: genres
    });
  } catch (error) {
    logger.error('Failed to retrieve genres', { error: error.message });
    next(error);
  }
};

export const updateGenreController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid genre ID is required'), { statusCode: 400 });
    }
    if (!name) {
      throw Object.assign(new Error('Genre name is required'), { statusCode: 400 });
    }

    const genre = await updateGenre(parseInt(id), name);
    
    logger.info('Genre updated successfully', {
      genreId: id,
      name,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: genre,
      message: 'Genre updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update genre', {
      error: error.message,
      genreId: req.params.id,
      name: req.body.name,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const deleteGenreController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid genre ID is required'), { statusCode: 400 });
    }

    const result = await deleteGenre(parseInt(id));
    
    logger.info('Genre deleted successfully', {
      genreId: id,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Genre deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete genre', {
      error: error.message,
      genreId: req.params.id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};