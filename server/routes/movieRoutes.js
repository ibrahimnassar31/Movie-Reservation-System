import { Router } from 'express';
import { createMovieController, getMoviesController, updateMovieController, deleteMovieController } from '../controllers/movieController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.post('/movies', verifyToken, restrictToAdmin, createMovieController);
router.get('/movies', getMoviesController);
router.put('/movies/:id', verifyToken, restrictToAdmin, updateMovieController);
router.delete('/movies/:id', verifyToken, restrictToAdmin, deleteMovieController);

export default router;