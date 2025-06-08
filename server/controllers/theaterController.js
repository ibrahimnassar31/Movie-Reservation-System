import { createTheater, getTheaters, updateTheater, deleteTheater } from '../services/theaterService.js';
import logger from '../utils/logger.js';

export const createTheaterController = async (req, res, next) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      throw Object.assign(new Error('Name and location are required'), { statusCode: 400 });
    }

    const theaterData = await createTheater(name, location);
    
    logger.info('Theater created successfully', {
      theaterId: theaterData.id,
      name,
      location,
      userId: req.user ? req.user.id : null
    });

    res.status(201).json({
      status: 'success',
      data: theaterData
    });
  } catch (error) {
    logger.error('Failed to create theater', {
      error: error.message,
      name: req.body.name,
      location: req.body.location,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const getTheatersController = async (req, res, next) => {
  try {
    const theaters = await getTheaters();
    
    logger.info('Theaters retrieved', { count: theaters.length });

    res.json({
      status: 'success',
      data: theaters
    });
  } catch (error) {
    logger.error('Failed to retrieve theaters', { error: error.message });
    next(error);
  }
};

export const updateTheaterController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid theater ID is required'), { statusCode: 400 });
    }
    if (!name || !location) {
      throw Object.assign(new Error('Name and location are required'), { statusCode: 400 });
    }

    const theaterData = await updateTheater(parseInt(id), name, location);
    
    logger.info('Theater updated successfully', {
      theaterId: id,
      name,
      location,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: theaterData,
      message: 'Theater updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update theater', {
      error: error.message,
      theaterId: req.params.id,
      name: req.body.name,
      location: req.body.location,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const deleteTheaterController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid theater ID is required'), { statusCode: 400 });
    }

    const result = await deleteTheater(parseInt(id));
    
    logger.info('Theater deleted successfully', {
      theaterId: id,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Theater deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete theater', {
      error: error.message,
      theaterId: req.params.id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};