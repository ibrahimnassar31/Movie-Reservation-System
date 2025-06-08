import { createShowtime, getShowtimes, updateShowtime, deleteShowtime } from '../services/showtimeService.js';
import logger from '../utils/logger.js';

export const createShowtimeController = async (req, res, next) => {
  try {
    const { movie_id, theater_id, showtime, price } = req.body;

    if (!movie_id || !theater_id || !showtime || !price) {
      throw Object.assign(new Error('Movie ID, Theater ID, Showtime, and Price are required'), { statusCode: 400 });
    }

    const showtimeData = await createShowtime(movie_id, theater_id, showtime, price);
    
    logger.info('Showtime created successfully', {
      showtimeId: showtimeData.id,
      movie_id,
      theater_id,
      showtime,
      price,
      userId: req.user ? req.user.id : null
    });

    res.status(201).json({
      status: 'success',
      data: showtimeData
    });
  } catch (error) {
    logger.error('Failed to create showtime', {
      error: error.message,
      movie_id: req.body.movie_id,
      theater_id: req.body.theater_id,
      showtime: req.body.showtime,
      price: req.body.price,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const getShowtimesController = async (req, res, next) => {
  try {
    const showtimes = await getShowtimes();
    
    logger.info('Showtimes retrieved', { count: showtimes.length });

    res.json({
      status: 'success',
      data: showtimes
    });
  } catch (error) {
    logger.error('Failed to retrieve showtimes', { error: error.message });
    next(error);
  }
};

export const updateShowtimeController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { movie_id, theater_id, showtime, price } = req.body;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid showtime ID is required'), { statusCode: 400 });
    }
    if (!movie_id || !theater_id || !showtime || !price) {
      throw Object.assign(new Error('Movie ID, Theater ID, Showtime, and Price are required'), { statusCode: 400 });
    }

    const showtimeData = await updateShowtime(parseInt(id), movie_id, theater_id, showtime, price);
    
    logger.info('Showtime updated successfully', {
      showtimeId: id,
      movie_id,
      theater_id,
      showtime,
      price,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: showtimeData,
      message: 'Showtime updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update showtime', {
      error: error.message,
      showtimeId: req.params.id,
      movie_id: req.body.movie_id,
      theater_id: req.body.theater_id,
      showtime: req.body.showtime,
      price: req.body.price,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const deleteShowtimeController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid showtime ID is required'), { statusCode: 400 });
    }

    const result = await deleteShowtime(parseInt(id));
    
    logger.info('Showtime deleted successfully', {
      showtimeId: id,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Showtime deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete showtime', {
      error: error.message,
      showtimeId: req.params.id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};