import rateLimit from 'express-rate-limit';

   export const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 دقيقة
     max: 100, // 100 طلب لكل IP في النافذة الزمنية
     message: {
       status: 'error',
       message: 'Too many requests from this IP, please try again after 15 minutes'
     },
     standardHeaders: true,
     legacyHeaders: false,
   });

   export const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 دقيقة
     max: 10, // 10 طلبات لتسجيل الدخول أو التسجيل
     message: {
       status: 'error',
       message: 'Too many login attempts, please try again after 15 minutes'
     },
     standardHeaders: true,
     legacyHeaders: false,
   });