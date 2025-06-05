import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const login = async (email, password) => {
  try {
    // Get user from database
    const [rows] = await pool.query(queries.getUserByEmail, [email]);
    const user = rows[0];

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signup = async (email, password, name) => {
  try {
    // Check if email already exists
    const [existingUsers] = await pool.query(queries.getUserByEmail, [email]);
    if (existingUsers.length > 0) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(queries.createUser, [email, hashedPassword, name, 'user']);
    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user: { id: userId, email, name, role: 'user' } };
  } catch (error) {
    throw new Error(error.message);
  }
};