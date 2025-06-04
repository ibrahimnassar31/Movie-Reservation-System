import express from 'express';
import { config } from 'dotenv';
import pool from './config/database.js';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Movie Reservation Backend is running!');
});

async function testConnection() {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to the database!');
      connection.release();
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
  testConnection();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});