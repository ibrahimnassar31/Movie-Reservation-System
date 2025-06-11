import express from 'express';
   import { config } from 'dotenv';
   import authRoutes from './routes/authRoutes.js';
   import movieRoutes from './routes/movieRoutes.js';
   import reservationRoutes from './routes/reservationRoutes.js';
   import genreRoutes from './routes/genreRoutes.js';
   import showtimeRoutes from './routes/showtimeRoutes.js';
   import movieGenreRoutes from './routes/movieGenreRoutes.js';
   import theaterRoutes from './routes/theaterRoutes.js';
   import seatRoutes from './routes/seatRoutes.js';
   import reviewRoutes from './routes/reviewRoutes.js';
   import promotionRoutes from './routes/promotionRoutes.js';
   import notificationRoutes from './routes/notificationRoutes.js';
   import cors from 'cors';
   import { errorHandler } from './middlewares/errorHandler.js';
   import { apiLimiter, authLimiter } from './middlewares/rateLimit.js';
   import { testConnection } from './utils/dbTest.js';

   config();

   const app = express();
   const port = process.env.PORT || 8000;

   app.use(express.json());

   // Rate Limiting
   app.use('/api', apiLimiter);
   app.use('/api/auth', authLimiter); // تقييد تسجيل الدخول/التسجيل

   // Routes
   app.use('/api', authRoutes);
   app.use('/api', movieRoutes);
   app.use('/api', reservationRoutes);
   app.use('/api', genreRoutes);
   app.use('/api', showtimeRoutes);
   app.use('/api', movieGenreRoutes);
   app.use('/api', theaterRoutes);
   app.use('/api', seatRoutes);
   app.use('/api', reviewRoutes);
   app.use('/api', promotionRoutes);
   app.use('/api', notificationRoutes);


   // Error Handler
   app.use(errorHandler);

    app.use(cors({
      origin: '*', // السماح للواجهة الأمامية
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
  }));

   app.get('/', (req, res) => {
     res.send('Movie Reservation Backend is running!');
   });

   testConnection().catch((error) => {
     console.error('Failed to start server due to database connection error:', error);
     process.exit(1);
   });

   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });