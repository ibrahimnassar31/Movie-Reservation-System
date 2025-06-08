import { Router } from 'express';
import { createGenreController, getGenresController, updateGenreController, deleteGenreController } from '../controllers/genreController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.get('/genres', getGenresController);
router.post('/genres', verifyToken, restrictToAdmin, createGenreController);
router.put('/genres/:id', verifyToken, restrictToAdmin, updateGenreController);
router.delete('/genres/:id', verifyToken, restrictToAdmin, deleteGenreController);

export default router;