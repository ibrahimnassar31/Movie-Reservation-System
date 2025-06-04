import pool from '../config/database.js';

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database!');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error; // Throw error to be handled by the caller
  }
};