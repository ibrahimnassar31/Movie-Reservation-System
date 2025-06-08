import { createReview, getReviewsByMovie, updateReview, deleteReview } from '../services/reviewService.js';
import logger from '../utils/logger.js';

export const createReviewController = async (req, res, next) => {
  try {
    const { movie_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    if (!movie_id || isNaN(movie_id)) {
      throw Object.assign(new Error('Valid movie ID is required'), { statusCode: 400 });
    }
    if (!rating || !Number.isInteger(rating)) {
      throw Object.assign(new Error('Rating must be an integer'), { statusCode: 400 });
    }

    const reviewData = await createReview(user_id, parseInt(movie_id), rating, comment);
    
    logger.info('Review created successfully', {
      reviewId: reviewData.id,
      userId: user_id,
      movieId: movie_id,
      rating,
      comment
    });

    res.status(201).json({
      status: 'success',
      data: reviewData
    });
  } catch (error) {
    logger.error('Failed to create review', {
      error: error.message,
      userId: req.user ? req.user.id : null,
      movieId: req.params.movie_id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    next(error);
  }
};

export const getReviewsByMovieController = async (req, res, next) => {
  try {
    const { movie_id } = req.params;

    if (!movie_id || isNaN(movie_id)) {
      throw Object.assign(new Error('Valid movie ID is required'), { statusCode: 400 });
    }

    const reviews = await getReviewsByMovie(parseInt(movie_id));
    
    logger.info('Reviews retrieved', {
      movieId: movie_id,
      count: reviews.length
    });

    res.json({
      status: 'success',
      data: reviews
    });
  } catch (error) {
    logger.error('Failed to retrieve reviews', {
      error: error.message,
      movieId: req.params.movie_id
    });
    next(error);
  }
};

export const updateReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;
    const role = req.user.role;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid review ID is required'), { statusCode: 400 });
    }
    if (!rating || !Number.isInteger(rating)) {
      throw Object.assign(new Error('Rating must be an integer'), { statusCode: 400 });
    }

    const reviewData = await updateReview(parseInt(id), user_id, role, rating, comment);
    
    logger.info('Review updated successfully', {
      reviewId: id,
      userId: user_id,
      rating,
      comment
    });

    res.json({
      status: 'success',
      data: reviewData,
      message: 'Review updated successfully'
    });
  } catch (error) {
    logger.error('Failed to update review', {
      error: error.message,
      reviewId: req.params.id,
      userId: req.user ? req.user.id : null,
      rating: req.body.rating,
      comment: req.body.comment
    });
    next(error);
  }
};

export const deleteReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const role = req.user.role;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid review ID is required'), { statusCode: 400 });
    }

    const result = await deleteReview(parseInt(id), user_id, role);
    
    logger.info('Review deleted successfully', {
      reviewId: id,
      userId: user_id
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete review', {
      error: error.message,
      reviewId: req.params.id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};