import { getReservationStats } from '../services/reportService.js';
import logger from '../utils/logger.js';

export const getReservationStatsController = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const stats = await getReservationStats(start_date, end_date);

    logger.info('Reservation stats retrieved successfully', {
      userId: req.user.id,
      totalReservations: stats.total_reservations,
      totalRevenue: stats.total_revenue,
      startDate: start_date || 'none',
      endDate: end_date || 'none'
    });

    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    logger.error('Failed to retrieve reservation stats', {
      error: error.message,
      userId: req.user ? req.user.id : null,
      startDate: req.query.start_date || 'none',
      endDate: req.query.end_date || 'none'
    });
    next(error);
  }
};