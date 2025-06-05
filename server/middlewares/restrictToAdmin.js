export const restrictToAdmin = (req, res, next) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        throw Object.assign(new Error('Access denied: Admins only'), { statusCode: 403 });
      }
      next();
    } catch (error) {
      next(error);
    }
  };