import pool from '../config/database.js';
import { queries } from '../sql/queries.js';

export const createNotification = async (user_id, message, type) => {
  try {
    // Validate inputs
    if (!user_id || isNaN(user_id)) {
      throw new Error('Valid user ID is required');
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
      throw new Error('Valid message is required');
    }
    if (!['reservation', 'promotion', 'showtime_change'].includes(type)) {
      throw new Error('Invalid notification type');
    }

    // Check if user exists
    const [userRows] = await pool.query(queries.checkUser, [user_id]);
    if (!userRows.length) {
      throw new Error('User not found');
    }

    const [result] = await pool.query(queries.createNotification, [user_id, message.trim(), type, 0]);
    return { id: result.insertId, user_id, message, type, is_read: 0 };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserNotifications = async (user_id) => {
  try {
    if (!user_id || isNaN(user_id)) {
      throw new Error('Valid user ID is required');
    }

    const [rows] = await pool.query(queries.getUserNotifications, [user_id]);
    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      message: row.message,
      type: row.type,
      is_read: !!row.is_read,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const markNotificationAsRead = async (notification_id, user_id) => {
  try {
    if (!notification_id || isNaN(notification_id)) {
      throw new Error('Valid notification ID is required');
    }
    if (!user_id || isNaN(user_id)) {
      throw new Error('Valid user ID is required');
    }

    const [notificationRows] = await pool.query(queries.checkNotification, [notification_id, user_id]);
    if (!notificationRows.length) {
      throw new Error('Notification not found or not authorized');
    }

    await pool.query(queries.updateNotificationRead, [notification_id, user_id]);
    return { id: notification_id, is_read: true };
  } catch (error) {
    throw new Error(error.message);
  }
};