import { Router } from 'express';
import { addMovieGenreController, getMovieGenresController, deleteMovieGenreController } from '../controllers/movieGenreController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.get('/movies/:id/genres', getMovieGenresController);
router.post('/movies/:id/genres', verifyToken, restrictToAdmin, addMovieGenreController);
router.delete('/movies/:id/genres/:genre_id', verifyToken, restrictToAdmin, deleteMovieGenreController);

export default router;