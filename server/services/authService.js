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