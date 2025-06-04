import express from 'express';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { testConnection } from './utils/dbTest.js';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', authRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Movie Reservation Backend is running!');
});

// Test database connection on startup
testConnection().catch((error) => {
  console.error('Failed to start server due to database connection error:', error);
  process.exit(1); // Exit process if connection fails
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});