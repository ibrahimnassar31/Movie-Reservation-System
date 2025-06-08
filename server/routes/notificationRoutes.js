import { Router } from 'express';
import { createNotificationController, getUserNotificationsController, markNotificationAsReadController } from '../controllers/notificationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { restrictToAdmin } from '../middlewares/restrictToAdmin.js';

const router = Router();

router.post('/notifications', verifyToken, restrictToAdmin, createNotificationController);
router.get('/notifications', verifyToken, getUserNotificationsController);
router.put('/notifications/:id/read', verifyToken, markNotificationAsReadController);

export default router;