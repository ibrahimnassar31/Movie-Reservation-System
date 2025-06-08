import { Router } from 'express';
import { createReviewController, getReviewsByMovieController, updateReviewController, deleteReviewController } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/movies/:movie_id/reviews', getReviewsByMovieController);
router.post('/movies/:movie_id/reviews', verifyToken, createReviewController);
router.put('/reviews/:id', verifyToken, updateReviewController);
router.delete('/reviews/:id', verifyToken, deleteReviewController);

export default router;