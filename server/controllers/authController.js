import { login, signup } from '../services/authService.js';

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

export const signupController = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw Object.assign(new Error('Email, password, and name are required'), { statusCode: 400 });
    }

    const { token, user } = await signup(email, password, name);
    res.status(201).json({
      status: 'success',
      data: { token, user }
    });
  } catch (error) {
    next(error);
  }
};