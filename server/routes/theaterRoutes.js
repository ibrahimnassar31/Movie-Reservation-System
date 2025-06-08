import { Router } from 'express';
import { createTheaterController, getTheatersController, updateTheaterController, deleteTheaterController } from '../controllers/theaterController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.get('/theaters', getTheatersController);
router.post('/theaters', verifyToken, restrictToAdmin, createTheaterController);
router.put('/theaters/:id', verifyToken, restrictToAdmin, updateTheaterController);
router.delete('/theaters/:id', verifyToken, restrictToAdmin, deleteTheaterController);

export default router;