import { Router } from 'express';
import { createPromotionController, getPromotionsController, updatePromotionController, deletePromotionController } from '../controllers/promotionController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.get('/promotions', getPromotionsController);
router.post('/promotions', verifyToken, restrictToAdmin, createPromotionController);
router.put('/promotions/:id', verifyToken, restrictToAdmin, updatePromotionController);
router.delete('/promotions/:id', verifyToken, restrictToAdmin, deletePromotionController);

export default router;