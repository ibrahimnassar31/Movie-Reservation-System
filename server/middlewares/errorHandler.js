export const errorHandler = (error, req, res, next) => {
    console.error(error.stack);
  
    const statusCode = error.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message;
  
    res.status(statusCode).json({
      status: 'error',
      message
    });
  };