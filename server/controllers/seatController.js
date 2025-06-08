import { createSeat, getSeatsByTheater, updateSeat, deleteSeat } from '../services/seatService.js';
import logger from '../utils/logger.js';

export const createSeatController = async (req, res, next) => {
  try {
    const { theater_id } = req.params;
    const { seat_number } = req.body;

    if (!theater_id || isNaN(theater_id)) {
      throw Object.assign(new Error('Valid theater ID is required'), { statusCode: 400 });
    }
    if (!seat_number || typeof seat_number !== 'string' || seat_number.trim() === '') {
      throw Object.assign(new Error('Valid seat number is required'), { statusCode: 400 });
    }

    const seatData = await createSeat(parseInt(theater_id), seat_number);
    
    logger.info('Seat created successfully', {
      seatId: seatData.id,
      theaterId: theater_id,
      seatNumber: seat_number,
      userId: req.user ? req.user.id : null
    });

    res.status(201).json({
      status: 'success',
      data: seatData
    });
  } catch (error) {
    logger.error('Failed to create seat', {
      error: error.message,
      theaterId: req.params.theater_id,
      seatNumber: req.body.seat_number,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const getSeatsByTheaterController = async (req, res, next) => {
  try {
    const { theater_id } = req.params;

    if (!theater_id || isNaN(theater_id)) {
      throw Object.assign(new Error('Valid theater ID is required'), { statusCode: 400 });
    }

    const seats = await getSeatsByTheater(parseInt(theater_id));
    
    logger.info('Seats retrieved', {
      theaterId: theater_id,
      count: seats.length
    });

    res.json({
      status: 'success',
      data: seats
    });
  } catch (error) {
    logger.error('Failed to retrieve seats', {
      error: error.message,
      theaterId: req.params.theater_id
    });
    next(error);
  }
};

export const updateSeatController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { seat_number } = req.body;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid seat ID is required'), { statusCode: 400 });
    }
    if (!seat_number || typeof seat_number !== 'string' || seat_number.trim() === '') {
      throw Object.assign(new Error('Valid seat number is required'), { statusCode: 400 });
    }

    const seatData = await updateSeat(parseInt(id), seat_number);
    
    logger.info('Seat updated successfully', {
      seatId: id,
      seatNumber: seat_number,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: seatData,
      message: 'Seat updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update seat', {
      error: error.message,
      seatId: req.params.id,
      seatNumber: req.body.seat_number,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const deleteSeatController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid seat ID is required'), { statusCode: 400 });
    }

    const result = await deleteSeat(parseInt(id));
    
    logger.info('Seat deleted successfully', {
      seatId: id,
      userId: req.user ? req.user.id : null
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Seat deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete seat', {
      error: error.message,
      seatId: req.params.id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};