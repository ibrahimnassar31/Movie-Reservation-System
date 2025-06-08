import { createNotification, getUserNotifications, markNotificationAsRead } from '../services/notificationService.js';
import logger from '../utils/logger.js';

export const createNotificationController = async (req, res, next) => {
  try {
    const { user_id, message, type } = req.body;

    if (!user_id || !message || !type) {
      throw Object.assign(new Error('User ID, message, and type are required'), { statusCode: 400 });
    }

    const notificationData = await createNotification(user_id, message, type);

    logger.info('Notification created successfully', {
      notificationId: notificationData.id,
      userId: user_id,
      type,
      message,
      adminId: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: notificationData
    });
  } catch (error) {
    logger.error('Failed to create notification', {
      error: error.message,
      userId: req.body.user_id,
      type: req.body.type,
      adminId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const getUserNotificationsController = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const notifications = await getUserNotifications(user_id);

    logger.info('User notifications retrieved', {
      userId: user_id,
      count: notifications.length
    });

    res.json({
      status: 'success',
      data: notifications
    });
  } catch (error) {
    logger.error('Failed to retrieve user notifications', {
      error: error.message,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};

export const markNotificationAsReadController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    if (!id || isNaN(id)) {
      throw Object.assign(new Error('Valid notification ID is required'), { statusCode: 400 });
    }

    const result = await markNotificationAsRead(id, user_id);

    logger.info('Notification marked as read', {
      notificationId: id,
      userId: user_id
    });

    res.json({
      status: 'success',
      data: result,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Failed to mark notification as read', {
      error: error.message,
      notificationId: req.params.id,
      userId: req.user ? req.user.id : null
    });
    next(error);
  }
};