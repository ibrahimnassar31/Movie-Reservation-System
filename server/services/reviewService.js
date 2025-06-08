import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createReview = async (user_id, movie_id, rating, comment) => {
  try {
    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    // Validate rating (1-5)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }

    // Validate comment (optional, but if provided, must be non-empty string)
    if (comment && (typeof comment !== 'string' || comment.trim() === '')) {
      throw new Error('Comment must be a non-empty string');
    }

    // Check if user already reviewed this movie
    const [existingReview] = await pool.query(queries.checkUserReview, [user_id, movie_id]);
    if (existingReview.length) {
      throw new Error('User already reviewed this movie');
    }

    const [result] = await pool.query(queries.createReview, [user_id, movie_id, rating, comment || null]);
    return { id: result.insertId, user_id, movie_id, rating, comment };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getReviewsByMovie = async (movie_id) => {
  try {
    // Check if movie exists
    const [movieRows] = await pool.query(queries.checkMovie, [movie_id]);
    if (!movieRows.length) {
      throw new Error('Movie not found');
    }

    const [rows] = await pool.query(queries.getReviewsByMovie, [movie_id]);
    return rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      user_name: row.user_name,
      movie_id: row.movie_id,
      rating: row.rating,
      comment: row.comment,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateReview = async (review_id, user_id, role, rating, comment) => {
  try {
    // Check if review exists
    const [reviewRows] = await pool.query(queries.checkReview, [review_id]);
    if (!reviewRows.length) {
      throw new Error('Review not found');
    }

    // Check if user is authorized (owner or admin)
    if (reviewRows[0].user_id !== user_id && role !== 'admin') {
      throw new Error('Unauthorized to update this review');
    }

    // Validate rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }

    // Validate comment
    if (comment && (typeof comment !== 'string' || comment.trim() === '')) {
      throw new Error('Comment must be a non-empty string');
    }

    await pool.query(queries.updateReview, [rating, comment || null, review_id]);
    return { id: review_id, user_id: reviewRows[0].user_id, movie_id: reviewRows[0].movie_id, rating, comment };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteReview = async (review_id, user_id, role) => {
  try {
    // Check if review exists
    const [reviewRows] = await pool.query(queries.checkReview, [review_id]);
    if (!reviewRows.length) {
      throw new Error('Review not found');
    }

    // Check if user is authorized (owner or admin)
    if (reviewRows[0].user_id !== user_id && role !== 'admin') {
      throw new Error('Unauthorized to delete this review');
    }

    await pool.query(queries.deleteReview, [review_id]);
    return { id: review_id };
  } catch (error) {
    throw new Error(error.message);
  }
};