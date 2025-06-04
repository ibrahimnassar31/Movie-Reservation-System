import { login } from '../services/authService.js';

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Object.assign(new Error('Email and password are required'), { statusCode: 400 });
    }

    const { token, user } = await login(email, password);
    res.json({
      status: 'success',
      data: { token, user }
    });
  } catch (error) {
    next(error);
  }
};