import { Router } from 'express';
import { loginController, signupController } from '../controllers/authController.js';

const router = Router();

router.post('/login', loginController);
router.post('/signup', signupController);

export default router;